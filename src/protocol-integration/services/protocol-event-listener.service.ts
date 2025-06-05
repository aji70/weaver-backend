import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Subject, Observable, from, of } from 'rxjs';
import { catchError, retry, mergeMap } from 'rxjs/operators';
import { ProtocolEventStorageService } from './protocol-event-storage.service';
import { ProtocolEvent, ProtocolEventType } from '../entities/protocol-event.entity';

export interface ProtocolConfig {
  id: string;
  rpcUrl: string;
  contractAddress: string;
  abi: any[];
  eventTypes: ProtocolEventType[];
  startBlock?: number;
}

@Injectable()
export class ProtocolEventListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProtocolEventListenerService.name);
  private providers: Map<string, ethers.providers.Provider> = new Map();
  private listeners: Map<string, ethers.Contract> = new Map();
  private eventSubject = new Subject<ProtocolEvent>();

  constructor(
    private readonly configService: ConfigService,
    private readonly eventStorage: ProtocolEventStorageService,
  ) {}

  async onModuleInit() {
    // Initialize providers and listeners for configured protocols
    const protocols = this.configService.get<ProtocolConfig[]>('protocols');
    if (protocols) {
      for (const protocol of protocols) {
        await this.setupProtocolListener(protocol);
      }
    }
  }

  async onModuleDestroy() {
    // Cleanup listeners
    for (const [protocolId, listener] of this.listeners.entries()) {
      this.logger.log(`Cleaning up listener for protocol ${protocolId}`);
      listener.removeAllListeners();
    }
  }

  private async setupProtocolListener(config: ProtocolConfig) {
    try {
      const provider = new ethers.providers.WebSocketProvider(config.rpcUrl);
      this.providers.set(config.id, provider);

      const contract = new ethers.Contract(
        config.contractAddress,
        config.abi,
        provider,
      );
      this.listeners.set(config.id, contract);

      // Setup event listeners for each event type
      for (const eventType of config.eventTypes) {
        this.setupEventTypeListener(config.id, contract, eventType);
      }

      this.logger.log(`Successfully setup listener for protocol ${config.id}`);
    } catch (error) {
      this.logger.error(`Failed to setup listener for protocol ${config.id}: ${error.message}`);
      throw error;
    }
  }

  private setupEventTypeListener(
    protocolId: string,
    contract: ethers.Contract,
    eventType: ProtocolEventType,
  ) {
    const eventName = this.getEventNameFromType(eventType);
    
    contract.on(eventName, async (...args) => {
      try {
        const event = args[args.length - 1]; // Last argument is the event object
        const protocolEvent: ProtocolEvent = {
          protocolId,
          eventType,
          payload: this.decodeEventPayload(event),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          processed: false,
        };

        await this.eventStorage.saveEvent(protocolEvent);
        this.eventSubject.next(protocolEvent);
      } catch (error) {
        this.logger.error(
          `Error processing ${eventType} event for protocol ${protocolId}: ${error.message}`,
        );
      }
    });
  }

  private getEventNameFromType(eventType: ProtocolEventType): string {
    switch (eventType) {
      case ProtocolEventType.REWARD_CLAIM:
        return 'RewardClaimed';
      case ProtocolEventType.TOKEN_TRANSFER:
        return 'Transfer';
      case ProtocolEventType.NFT_MINT:
        return 'Mint';
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }
  }

  private decodeEventPayload(event: ethers.Event): Record<string, any> {
    return {
      ...event.args,
      eventName: event.event,
    };
  }

  getEventStream(): Observable<ProtocolEvent> {
    return this.eventSubject.asObservable();
  }

  async addProtocol(config: ProtocolConfig): Promise<void> {
    await this.setupProtocolListener(config);
  }

  async removeProtocol(protocolId: string): Promise<void> {
    const listener = this.listeners.get(protocolId);
    if (listener) {
      listener.removeAllListeners();
      this.listeners.delete(protocolId);
    }

    const provider = this.providers.get(protocolId);
    if (provider) {
      await provider.destroy();
      this.providers.delete(protocolId);
    }
  }
} 