"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StarkNetProviderService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarkNetProviderService = void 0;
const common_1 = require("@nestjs/common");
const starknet_1 = require("starknet");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const provider_options_interface_1 = require("./interfaces/provider-options.interface");
let StarkNetProviderService = StarkNetProviderService_1 = class StarkNetProviderService {
    configService;
    cacheManager;
    logger = new common_1.Logger(StarkNetProviderService_1.name);
    provider;
    options;
    networkStatus;
    defaultOptions = {
        network: provider_options_interface_1.StarkNetNetwork.MAINNET,
        providerType: provider_options_interface_1.ProviderType.RPC,
        retryAttempts: 3,
        retryDelay: 1000,
        timeout: 30000,
        cacheEnabled: true,
        cacheTTL: 60000,
    };
    constructor(configService, cacheManager) {
        this.configService = configService;
        this.cacheManager = cacheManager;
    }
    async onModuleInit() {
        await this.initialize({
            ...this.defaultOptions,
            network: this.configService.get('STARKNET_NETWORK') ||
                provider_options_interface_1.StarkNetNetwork.MAINNET,
            nodeUrl: this.configService.get('STARKNET_NODE_URL'),
            apiKey: this.configService.get('STARKNET_API_KEY'),
        });
    }
    async initialize(options) {
        this.options = { ...this.defaultOptions, ...options };
        await this.setupProvider();
        await this.updateNetworkStatus();
    }
    getProvider() {
        if (!this.provider) {
            throw new common_1.InternalServerErrorException('Provider not initialized');
        }
        return this.provider;
    }
    async getNetworkStatus() {
        await this.updateNetworkStatus();
        return this.networkStatus;
    }
    async switchNetwork(network) {
        this.options.network = network;
        await this.setupProvider();
        await this.updateNetworkStatus();
    }
    async callRPC(method, params) {
        const cacheKey = `rpc:${method}:${JSON.stringify(params)}`;
        if (this.options.cacheEnabled) {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        try {
            const result = await this.executeWithRetry(() => this.provider.request(method, params));
            if (this.options.cacheEnabled) {
                await this.cacheManager.set(cacheKey, result, this.options.cacheTTL);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`RPC call failed: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`RPC call failed: ${error.message}`);
        }
    }
    async getBlock(blockIdentifier) {
        const cacheKey = `block:${blockIdentifier}`;
        if (this.options.cacheEnabled) {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        try {
            const block = await this.executeWithRetry(() => this.provider.getBlock(blockIdentifier));
            if (this.options.cacheEnabled) {
                await this.cacheManager.set(cacheKey, block, this.options.cacheTTL);
            }
            return block;
        }
        catch (error) {
            this.logger.error(`Failed to get block: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to get block: ${error.message}`);
        }
    }
    async getTransaction(hash) {
        const cacheKey = `tx:${hash}`;
        if (this.options.cacheEnabled) {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        try {
            const tx = await this.executeWithRetry(() => this.provider.getTransaction(hash));
            if (this.options.cacheEnabled) {
                await this.cacheManager.set(cacheKey, tx, this.options.cacheTTL);
            }
            return tx;
        }
        catch (error) {
            this.logger.error(`Failed to get transaction: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to get transaction: ${error.message}`);
        }
    }
    async estimateFee(contractAddress, entrypoint, calldata) {
        try {
            const estimatedFee = await this.executeWithRetry(() => this.provider.estimateFee({
                contractAddress,
                entrypoint,
                calldata,
            }, { blockIdentifier: 'latest' }));
            return {
                amount: estimatedFee.amount.toString(),
                unit: 'wei',
            };
        }
        catch (error) {
            this.logger.error(`Failed to estimate fee: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to estimate fee: ${error.message}`);
        }
    }
    async setupProvider() {
        try {
            let nodeUrl;
            switch (this.options.providerType) {
                case provider_options_interface_1.ProviderType.INFURA:
                    nodeUrl = `https://${this.options.network}.infura.io/v3/${this.options.apiKey}`;
                    break;
                case provider_options_interface_1.ProviderType.ALCHEMY:
                    nodeUrl = `https://${this.options.network}.g.alchemy.com/v2/${this.options.apiKey}`;
                    break;
                case provider_options_interface_1.ProviderType.RPC:
                    nodeUrl = this.options.nodeUrl;
                    if (!nodeUrl) {
                        throw new Error('Node URL is required for RPC provider type');
                    }
                    break;
                default:
                    throw new Error(`Unsupported provider type: ${this.options.providerType}`);
            }
            this.provider = new starknet_1.RpcProvider({
                nodeUrl,
                chainId: this.getChainId(),
            });
            await this.provider.getChainId();
        }
        catch (error) {
            this.logger.error(`Failed to setup provider: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to setup provider: ${error.message}`);
        }
    }
    async updateNetworkStatus() {
        const startTime = Date.now();
        try {
            const [blockNumber, chainId] = await Promise.all([
                this.provider.getBlockNumber(),
                this.provider.getChainId(),
            ]);
            const block = await this.provider.getBlock('latest');
            const syncStatus = await this.provider.request('starknet_syncing', []);
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
                providerUrl: this.provider.nodeUrl,
            };
        }
        catch (error) {
            this.networkStatus = {
                isConnected: false,
                latency: Date.now() - startTime,
                lastError: error.message,
                lastSync: new Date(),
                providerUrl: this.provider.nodeUrl,
            };
            this.logger.error(`Failed to update network status: ${error.message}`, error.stack);
        }
    }
    getChainId() {
        switch (this.options.network) {
            case provider_options_interface_1.StarkNetNetwork.MAINNET:
                return starknet_1.constants.StarknetChainId.SN_MAIN;
            case provider_options_interface_1.StarkNetNetwork.TESTNET:
                return starknet_1.constants.StarknetChainId.SN_GOERLI;
            case provider_options_interface_1.StarkNetNetwork.TESTNET2:
                return starknet_1.constants.StarknetChainId.SN_GOERLI2;
            case provider_options_interface_1.StarkNetNetwork.DEVNET:
                return '1';
            default:
                throw new Error(`Unsupported network: ${this.options.network}`);
        }
    }
    async executeWithRetry(operation) {
        let lastError;
        for (let i = 0; i < this.options.retryAttempts; i++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (i < this.options.retryAttempts - 1) {
                    this.logger.warn(`Operation failed, retrying (${i + 1}/${this.options.retryAttempts}): ${error.message}`);
                    await new Promise((resolve) => setTimeout(resolve, this.options.retryDelay));
                }
            }
        }
        throw lastError;
    }
};
exports.StarkNetProviderService = StarkNetProviderService;
exports.StarkNetProviderService = StarkNetProviderService = StarkNetProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_1.ConfigService, typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object])
], StarkNetProviderService);
//# sourceMappingURL=starknet-provider.service.js.map