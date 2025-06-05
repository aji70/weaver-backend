import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtocolEventStorageService } from './protocol-event-storage.service';
import { ProtocolEvent, ProtocolEventType } from '../entities/protocol-event.entity';

describe('ProtocolEventStorageService', () => {
  let service: ProtocolEventStorageService;
  let repository: Repository<ProtocolEvent>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolEventStorageService,
        {
          provide: getRepositoryToken(ProtocolEvent),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProtocolEventStorageService>(ProtocolEventStorageService);
    repository = module.get<Repository<ProtocolEvent>>(getRepositoryToken(ProtocolEvent));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveEvent', () => {
    it('should save an event successfully', async () => {
      const event = {
        protocolId: 'test-protocol',
        eventType: ProtocolEventType.REWARD_CLAIM,
        payload: { amount: '100' },
        blockNumber: 123,
        transactionHash: '0xabc',
      };

      const savedEvent = { ...event, id: '1', timestamp: new Date() };
      mockRepository.save.mockResolvedValue(savedEvent);

      const result = await service.saveEvent(event);

      expect(mockRepository.save).toHaveBeenCalledWith(event);
      expect(result).toEqual(savedEvent);
    });

    it('should handle save errors', async () => {
      const event = {
        protocolId: 'test-protocol',
        eventType: ProtocolEventType.REWARD_CLAIM,
        payload: { amount: '100' },
        blockNumber: 123,
        transactionHash: '0xabc',
      };

      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.saveEvent(event)).rejects.toThrow('Save failed');
    });
  });

  describe('getUnprocessedEvents', () => {
    it('should return unprocessed events', async () => {
      const events = [
        {
          id: '1',
          protocolId: 'test-protocol',
          eventType: ProtocolEventType.REWARD_CLAIM,
          processed: false,
        },
      ];

      mockRepository.find.mockResolvedValue(events);

      const result = await service.getUnprocessedEvents();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { processed: false },
        order: { timestamp: 'ASC' },
      });
      expect(result).toEqual(events);
    });
  });

  describe('markEventAsProcessed', () => {
    it('should mark an event as processed', async () => {
      const eventId = '1';

      await service.markEventAsProcessed(eventId);

      expect(mockRepository.update).toHaveBeenCalledWith(eventId, { processed: true });
    });
  });

  describe('getEventsByProtocol', () => {
    it('should return events with pagination', async () => {
      const events = [
        {
          id: '1',
          protocolId: 'test-protocol',
          eventType: ProtocolEventType.REWARD_CLAIM,
        },
      ];

      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getManyAndCount.mockResolvedValue([events, 1]);

      const result = await service.getEventsByProtocol('test-protocol', {
        limit: 10,
        offset: 0,
      });

      expect(queryBuilder.where).toHaveBeenCalledWith('event.protocolId = :protocolId', {
        protocolId: 'test-protocol',
      });
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(result).toEqual([events, 1]);
    });
  });

  describe('getLatestBlockNumber', () => {
    it('should return the latest block number', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getRawOne.mockResolvedValue({ maxBlock: 123 });

      const result = await service.getLatestBlockNumber('test-protocol');

      expect(queryBuilder.select).toHaveBeenCalledWith('MAX(event.blockNumber)', 'maxBlock');
      expect(queryBuilder.where).toHaveBeenCalledWith('event.protocolId = :protocolId', {
        protocolId: 'test-protocol',
      });
      expect(result).toBe(123);
    });

    it('should return 0 if no blocks found', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getRawOne.mockResolvedValue(null);

      const result = await service.getLatestBlockNumber('test-protocol');

      expect(result).toBe(0);
    });
  });
}); 