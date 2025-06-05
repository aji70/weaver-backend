import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtocolEvent } from '../entities/protocol-event.entity';

@Injectable()
export class ProtocolEventStorageService {
  private readonly logger = new Logger(ProtocolEventStorageService.name);

  constructor(
    @InjectRepository(ProtocolEvent)
    private readonly eventRepository: Repository<ProtocolEvent>,
  ) {}

  async saveEvent(event: Partial<ProtocolEvent>): Promise<ProtocolEvent> {
    try {
      const savedEvent = await this.eventRepository.save(event);
      this.logger.debug(`Saved event for protocol ${event.protocolId}`);
      return savedEvent;
    } catch (error) {
      this.logger.error(`Failed to save event: ${error.message}`);
      throw error;
    }
  }

  async getUnprocessedEvents(): Promise<ProtocolEvent[]> {
    return this.eventRepository.find({
      where: { processed: false },
      order: { timestamp: 'ASC' },
    });
  }

  async markEventAsProcessed(eventId: string): Promise<void> {
    await this.eventRepository.update(eventId, { processed: true });
  }

  async getEventsByProtocol(
    protocolId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      eventType?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<[ProtocolEvent[], number]> {
    const query = this.eventRepository.createQueryBuilder('event')
      .where('event.protocolId = :protocolId', { protocolId });

    if (options.startDate) {
      query.andWhere('event.timestamp >= :startDate', { startDate: options.startDate });
    }

    if (options.endDate) {
      query.andWhere('event.timestamp <= :endDate', { endDate: options.endDate });
    }

    if (options.eventType) {
      query.andWhere('event.eventType = :eventType', { eventType: options.eventType });
    }

    query.orderBy('event.timestamp', 'DESC');

    if (options.limit) {
      query.take(options.limit);
    }

    if (options.offset) {
      query.skip(options.offset);
    }

    return query.getManyAndCount();
  }

  async getLatestBlockNumber(protocolId: string): Promise<number> {
    const result = await this.eventRepository
      .createQueryBuilder('event')
      .select('MAX(event.blockNumber)', 'maxBlock')
      .where('event.protocolId = :protocolId', { protocolId })
      .getRawOne();

    return result?.maxBlock || 0;
  }
} 