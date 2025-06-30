export declare enum StarkNetNetwork {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    TESTNET2 = "testnet2",
    DEVNET = "devnet"
}
export declare enum ProviderType {
    RPC = "rpc",
    INFURA = "infura",
    ALCHEMY = "alchemy"
}
export interface ProviderOptions {
    network: StarkNetNetwork;
    providerType: ProviderType;
    nodeUrl?: string;
    apiKey?: string;
    retryAttempts?: number;
    retryDelay?: number;
    timeout?: number;
    cacheEnabled?: boolean;
    cacheTTL?: number;
}
