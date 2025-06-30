import { ProtocolAdapter } from './protocol-adapter.interface';
export declare class ProtocolAdapterFactory {
    private adapters;
    registerAdapter(protocolId: string, adapter: ProtocolAdapter): void;
    getAdapter(protocolId: string): ProtocolAdapter;
    getAllAdapters(): ProtocolAdapter[];
}
