import { Injectable } from '@nestjs/common';
import { ProtocolAdapter } from './protocol-adapter.interface';

@Injectable()
export class ProtocolAdapterFactory {
  private adapters: Map<string, ProtocolAdapter> = new Map();

  registerAdapter(protocolId: string, adapter: ProtocolAdapter) {
    this.adapters.set(protocolId, adapter);
  }

  getAdapter(protocolId: string): ProtocolAdapter {
    const adapter = this.adapters.get(protocolId);
    if (!adapter) {
      throw new Error(`No adapter found for protocol: ${protocolId}`);
    }
    return adapter;
  }

  getAllAdapters(): ProtocolAdapter[] {
    return Array.from(this.adapters.values());
  }
} 