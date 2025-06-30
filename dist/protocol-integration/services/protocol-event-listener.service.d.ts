import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
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
export declare class ProtocolEventListenerService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly eventStorage;
    private readonly logger;
    private providers;
    private listeners;
    private eventSubject;
    constructor(configService: ConfigService, eventStorage: ProtocolEventStorageService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private setupProtocolListener;
    private setupEventTypeListener;
    private getEventNameFromType;
    private decodeEventPayload;
    getEventStream(): Observable<ProtocolEvent>;
    addProtocol(config: ProtocolConfig): Promise<void>;
    removeProtocol(protocolId: string): Promise<void>;
}
