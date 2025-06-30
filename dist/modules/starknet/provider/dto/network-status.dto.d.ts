import { NetworkInfo } from '../interfaces/network-info.interface';
import { StarkNetNetwork } from '../interfaces/provider-options.interface';
export declare class NetworkStatusDto {
    isConnected: boolean;
    latency: number;
    networkInfo?: NetworkInfo;
    lastError?: string;
    lastSync: Date;
    providerUrl: string;
}
export declare class NetworkInfoDto implements NetworkInfo {
    chainId: string;
    network: StarkNetNetwork;
    blockNumber: number;
    blockHash: string;
    gasPrice?: string;
    syncStatus: {
        starting: number;
        current: number;
        highest: number;
        syncing: boolean;
    };
}
export declare class SyncStatusDto {
    starting: number;
    current: number;
    highest: number;
    syncing: boolean;
}
