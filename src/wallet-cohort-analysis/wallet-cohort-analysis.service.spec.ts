import { Test, TestingModule } from '@nestjs/testing';
import { WalletCohortAnalysisService } from './wallet-cohort-analysis.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cohort } from './entities/cohort.entity';
import { User } from '../users/entities/user.entity';
import { TokenTransfer } from '../tokens/entities/token-transfer.entity';
import { CampaignMetric } from '../campaign-analytics/schemas/campaign-metric.schema';

type CohortModelMock = jest.Mock & {
  findById: jest.Mock;
  find: jest.Mock;
  create: jest.Mock;
};

describe('WalletCohortAnalysisService', () => {
  let service: WalletCohortAnalysisService;
  let cohortModel: CohortModelMock;
  let saveMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn();
    cohortModel = Object.assign(
      jest.fn().mockImplementation(() => ({ save: saveMock })),
      {
        findById: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
      },
    ) as CohortModelMock;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletCohortAnalysisService,
        { provide: getModelToken(Cohort.name), useValue: cohortModel },
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(TokenTransfer.name), useValue: {} },
        { provide: getModelToken(CampaignMetric.name), useValue: {} },
      ],
    }).compile();

    service = module.get<WalletCohortAnalysisService>(
      WalletCohortAnalysisService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCohort', () => {
    it('should create and return a cohort', async () => {
      const dto: Cohort = {
        name: 'Test',
        type: 'whale',
        criteria: {},
        members: [],
      } as Cohort;
      saveMock.mockResolvedValue({ ...dto, _id: '1', members: [] });
      const result = await service.createCohort(dto);
      expect(result).toEqual({ ...dto, _id: '1', members: [] });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('getCohortById', () => {
    it('should return a cohort by id', async () => {
      const cohort = {
        _id: '1',
        name: 'Test',
        type: 'whale',
        criteria: {},
        members: [],
      };
      cohortModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cohort),
      });
      const result = await service.getCohortById('1');
      expect(result).toEqual(cohort);
      expect(cohortModel.findById).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException if cohort not found', async () => {
      cohortModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.getCohortById('notfound')).rejects.toThrow(
        'Cohort not found',
      );
    });
  });
});
