import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProtocolEventListenerService } from './protocol-event-listener.service';
import { ProtocolEventStorageService } from './protocol-event-storage.service';
import { ProtocolEventType } from '../entities/protocol-event.entity';
import { ethers } from 'ethers';

jest.mock('ethers');

describe('ProtocolEventListenerService', () => {
  let service: ProtocolEventListenerService;
  let configService: ConfigService;
  let eventStorage: ProtocolEventStorageService;

  const mockConfig = {
    get: jest.fn().mockReturnValue([
      {
        id: 'test-protocol',
        rpcUrl: 'wss://test-rpc',
        contractAddress: '0x123',
        abi: [],
        eventTypes: [ProtocolEventType.REWARD_CLAIM],
      },
    ]),
  };

  const mockEventStorage = {
    saveEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolEventListenerService,
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
        {
          provide: ProtocolEventStorageService,
          useValue: mockEventStorage,
        },
      ],
    }).compile();

    service = module.get<ProtocolEventListenerService>(ProtocolEventListenerService);
    configService = module.get<ConfigService>(ConfigService);
    eventStorage = module.get<ProtocolEventStorageService>(ProtocolEventStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should setup listeners for configured protocols', async () => {
      const mockProvider = {
        on: jest.fn(),
      };

      const mockContract = {
        on: jest.fn(),
      };

      (ethers.providers.WebSocketProvider as jest.Mock).mockImplementation(() => mockProvider);
      (ethers.Contract as jest.Mock).mockImplementation(() => mockContract);

      await service.onModuleInit();

      expect(ethers.providers.WebSocketProvider).toHaveBeenCalledWith('wss://test-rpc');
      expect(ethers.Contract).toHaveBeenCalledWith('0x123', [], mockProvider);
    });
  });

  describe('getEventStream', () => {
    it('should return an observable of events', () => {
      const stream = service.getEventStream();
      expect(stream).toBeDefined();
    });
  });

  describe('addProtocol', () => {
    it('should setup a new protocol listener', async () => {
      const mockProvider = {
        on: jest.fn(),
      };

      const mockContract = {
        on: jest.fn(),
      };

      (ethers.providers.WebSocketProvider as jest.Mock).mockImplementation(() => mockProvider);
      (ethers.Contract as jest.Mock).mockImplementation(() => mockContract);

      const newProtocol = {
        id: 'new-protocol',
        rpcUrl: 'wss://new-rpc',
        contractAddress: '0x456',
        abi: [],
        eventTypes: [ProtocolEventType.TOKEN_TRANSFER],
      };

      await service.addProtocol(newProtocol);

      expect(ethers.providers.WebSocketProvider).toHaveBeenCalledWith('wss://new-rpc');
      expect(ethers.Contract).toHaveBeenCalledWith('0x456', [], mockProvider);
    });
  });

  describe('removeProtocol', () => {
    it('should remove protocol listeners and cleanup', async () => {
      const mockListener = {
        removeAllListeners: jest.fn(),
      };

      const mockProvider = {
        destroy: jest.fn(),
      };

      service['listeners'].set('test-protocol', mockListener as any);
      service['providers'].set('test-protocol', mockProvider as any);

      await service.removeProtocol('test-protocol');

      expect(mockListener.removeAllListeners).toHaveBeenCalled();
      expect(mockProvider.destroy).toHaveBeenCalled();
      expect(service['listeners'].has('test-protocol')).toBeFalsy();
      expect(service['providers'].has('test-protocol')).toBeFalsy();
    });
  });
}); 