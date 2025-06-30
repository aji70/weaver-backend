import { Repository } from 'typeorm';
import { ProtocolEvent } from '../entities/protocol-event.entity';
export declare class ProtocolEventStorageService {
    private readonly eventRepository;
    private readonly logger;
    constructor(eventRepository: Repository<ProtocolEvent>);
    saveEvent(event: Partial<ProtocolEvent>): Promise<ProtocolEvent>;
    getUnprocessedEvents(): Promise<ProtocolEvent[]>;
    markEventAsProcessed(eventId: string): Promise<void>;
    getEventsByProtocol(protocolId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        eventType?: string;
        limit?: number;
        offset?: number;
    }): Promise<[ProtocolEvent[], number]>;
    getLatestBlockNumber(protocolId: string): Promise<number>;
}
