import { OnModuleInit } from '@nestjs/common';
import { Provider, Block, GetTransactionResponse } from 'starknet';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { IStarkNetProvider } from './starknet-provider.interface';
import { ProviderOptions, StarkNetNetwork } from './interfaces/provider-options.interface';
import { NetworkStatus } from './interfaces/network-info.interface';
export declare class StarkNetProviderService implements IStarkNetProvider, OnModuleInit {
    private configService;
    private cacheManager;
    private readonly logger;
    private provider;
    private options;
    private networkStatus;
    private readonly defaultOptions;
    constructor(configService: ConfigService, cacheManager: Cache);
    onModuleInit(): Promise<void>;
    initialize(options: ProviderOptions): Promise<void>;
    getProvider(): Provider;
    getNetworkStatus(): Promise<NetworkStatus>;
    switchNetwork(network: StarkNetNetwork): Promise<void>;
    callRPC(method: string, params: any[]): Promise<any>;
    getBlock(blockIdentifier: string | number): Promise<Block>;
    getTransaction(hash: string): Promise<GetTransactionResponse>;
    estimateFee(contractAddress: string, entrypoint: string, calldata: any[]): Promise<{
        amount: string;
        unit: string;
    }>;
    private setupProvider;
    private updateNetworkStatus;
    private getChainId;
    private executeWithRetry;
}
