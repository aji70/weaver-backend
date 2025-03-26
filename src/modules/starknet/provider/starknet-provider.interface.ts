import { Provider, Block, GetTransactionResponse } from 'starknet';
import { NetworkStatus } from './interfaces/network-info.interface';
import {
  ProviderOptions,
  StarkNetNetwork,
} from './interfaces/provider-options.interface';

export interface IStarkNetProvider {
  getProvider(): Provider;
  getNetworkStatus(): Promise<NetworkStatus>;
  switchNetwork(network: StarkNetNetwork): Promise<void>;
  callRPC(method: string, params: any[]): Promise<any>;
  getBlock(blockIdentifier: string | number): Promise<Block>;
  getTransaction(hash: string): Promise<GetTransactionResponse>;
  estimateFee(
    contractAddress: string,
    entrypoint: string,
    calldata: any[],
  ): Promise<{
    amount: string;
    unit: string;
  }>;
  initialize(options: ProviderOptions): Promise<void>;
}
