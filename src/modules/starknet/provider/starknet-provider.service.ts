import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Provider,
  RpcProvider,
  Block,
  GetTransactionResponse,
  constants,
} from 'starknet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStarkNetProvider } from './starknet-provider.interface';
import {
  ProviderOptions,
  StarkNetNetwork,
  ProviderType,
} from './interfaces/provider-options.interface';
import { NetworkStatus } from './interfaces/network-info.interface';

@Injectable()
export class StarkNetProviderService
  implements IStarkNetProvider, OnModuleInit
{
  private readonly logger = new Logger(StarkNetProviderService.name);
  private provider: Provider;
  private options: ProviderOptions;
  private networkStatus: NetworkStatus;
  private readonly defaultOptions: Partial<ProviderOptions> = {
    network: StarkNetNetwork.MAINNET,
    providerType: ProviderType.RPC,
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 30000,
    cacheEnabled: true,
    cacheTTL: 60000, // 1 minute
  };

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    await this.initialize({
      ...this.defaultOptions,
      network:
        this.configService.get<StarkNetNetwork>('STARKNET_NETWORK') ||
        StarkNetNetwork.MAINNET,
      nodeUrl: this.configService.get<string>('STARKNET_NODE_URL'),
      apiKey: this.configService.get<string>('STARKNET_API_KEY'),
    });
  }

  async initialize(options: ProviderOptions): Promise<void> {
    this.options = { ...this.defaultOptions, ...options };
    await this.setupProvider();
    await this.updateNetworkStatus();
  }

  getProvider(): Provider {
    if (!this.provider) {
      throw new InternalServerErrorException('Provider not initialized');
    }
    return this.provider;
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    await this.updateNetworkStatus();
    return this.networkStatus;
  }

  async switchNetwork(network: StarkNetNetwork): Promise<void> {
    this.options.network = network;
    await this.setupProvider();
    await this.updateNetworkStatus();
  }

  async callRPC(method: string, params: any[]): Promise<any> {
    const cacheKey = `rpc:${method}:${JSON.stringify(params)}`;

    if (this.options.cacheEnabled) {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const result = await this.executeWithRetry(() =>
        (this.provider as RpcProvider).request(method, params),
      );

      if (this.options.cacheEnabled) {
        await this.cacheManager.set(cacheKey, result, this.options.cacheTTL);
      }

      return result;
    } catch (error) {
      this.logger.error(`RPC call failed: ${error.message}`, error.stack);
      throw new BadRequestException(`RPC call failed: ${error.message}`);
    }
  }

  async getBlock(blockIdentifier: string | number): Promise<Block> {
    const cacheKey = `block:${blockIdentifier}`;

    if (this.options.cacheEnabled) {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return cached as Block;
      }
    }

    try {
      const block = await this.executeWithRetry(() =>
        this.provider.getBlock(blockIdentifier),
      );

      if (this.options.cacheEnabled) {
        await this.cacheManager.set(cacheKey, block, this.options.cacheTTL);
      }

      return block;
    } catch (error) {
      this.logger.error(`Failed to get block: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get block: ${error.message}`);
    }
  }

  async getTransaction(hash: string): Promise<GetTransactionResponse> {
    const cacheKey = `tx:${hash}`;

    if (this.options.cacheEnabled) {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return cached as GetTransactionResponse;
      }
    }

    try {
      const tx = await this.executeWithRetry(() =>
        this.provider.getTransaction(hash),
      );

      if (this.options.cacheEnabled) {
        await this.cacheManager.set(cacheKey, tx, this.options.cacheTTL);
      }

      return tx;
    } catch (error) {
      this.logger.error(
        `Failed to get transaction: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get transaction: ${error.message}`,
      );
    }
  }

  async estimateFee(
    contractAddress: string,
    entrypoint: string,
    calldata: any[],
  ): Promise<{ amount: string; unit: string }> {
    try {
      const estimatedFee = await this.executeWithRetry(() =>
        this.provider.estimateFee(
          {
            contractAddress,
            entrypoint,
            calldata,
          },
          { blockIdentifier: 'latest' },
        ),
      );

      return {
        amount: estimatedFee.amount.toString(),
        unit: 'wei',
      };
    } catch (error) {
      this.logger.error(
        `Failed to estimate fee: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to estimate fee: ${error.message}`);
    }
  }

  private async setupProvider(): Promise<void> {
    try {
      let nodeUrl: string;

      switch (this.options.providerType) {
        case ProviderType.INFURA:
          nodeUrl = `https://${this.options.network}.infura.io/v3/${this.options.apiKey}`;
          break;
        case ProviderType.ALCHEMY:
          nodeUrl = `https://${this.options.network}.g.alchemy.com/v2/${this.options.apiKey}`;
          break;
        case ProviderType.RPC:
          nodeUrl = this.options.nodeUrl;
          if (!nodeUrl) {
            throw new Error('Node URL is required for RPC provider type');
          }
          break;
        default:
          throw new Error(
            `Unsupported provider type: ${this.options.providerType}`,
          );
      }

      this.provider = new RpcProvider({
        nodeUrl,
        chainId: this.getChainId(),
      });

      await this.provider.getChainId();
    } catch (error) {
      this.logger.error(
        `Failed to setup provider: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to setup provider: ${error.message}`,
      );
    }
  }

  private async updateNetworkStatus(): Promise<void> {
    const startTime = Date.now();
    try {
      const [blockNumber, chainId] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getChainId(),
      ]);

      const block = await this.provider.getBlock('latest');
      const syncStatus = await (this.provider as RpcProvider).request(
        'starknet_syncing',
        [],
      );

      this.networkStatus = {
        isConnected: true,
        latency: Date.now() - startTime,
        networkInfo: {
          chainId: chainId.toString(),
          network: this.options.network,
          blockNumber: blockNumber,
          blockHash: block.block_hash,
          syncStatus: {
            starting: syncStatus.starting_block_num || 0,
            current: syncStatus.current_block_num || blockNumber,
            highest: syncStatus.highest_block_num || blockNumber,
            syncing: Boolean(syncStatus.syncing),
          },
        },
        lastSync: new Date(),
        providerUrl: (this.provider as RpcProvider).nodeUrl,
      };
    } catch (error) {
      this.networkStatus = {
        isConnected: false,
        latency: Date.now() - startTime,
        lastError: error.message,
        lastSync: new Date(),
        providerUrl: (this.provider as RpcProvider).nodeUrl,
      };
      this.logger.error(
        `Failed to update network status: ${error.message}`,
        error.stack,
      );
    }
  }

  private getChainId(): string {
    switch (this.options.network) {
      case StarkNetNetwork.MAINNET:
        return constants.StarknetChainId.SN_MAIN;
      case StarkNetNetwork.TESTNET:
        return constants.StarknetChainId.SN_GOERLI;
      case StarkNetNetwork.TESTNET2:
        return constants.StarknetChainId.SN_GOERLI2;
      case StarkNetNetwork.DEVNET:
        return '1';
      default:
        throw new Error(`Unsupported network: ${this.options.network}`);
    }
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    for (let i = 0; i < this.options.retryAttempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < this.options.retryAttempts - 1) {
          this.logger.warn(
            `Operation failed, retrying (${i + 1}/${
              this.options.retryAttempts
            }): ${error.message}`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.options.retryDelay),
          );
        }
      }
    }
    throw lastError;
  }
}
