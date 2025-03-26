import { StarkNetNetwork } from './provider-options.interface';

export interface NetworkInfo {
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

export interface NetworkStatus {
  isConnected: boolean;
  latency: number;
  networkInfo?: NetworkInfo;
  lastError?: string;
  lastSync: Date;
  providerUrl: string;
}
