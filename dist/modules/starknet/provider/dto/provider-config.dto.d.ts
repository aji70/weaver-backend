import { StarkNetNetwork, ProviderType } from '../interfaces/provider-options.interface';
export declare class ProviderConfigDto {
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
