import { Repository } from 'typeorm';
import { ReputationScore } from './entities/reputation-score.entity';
import { ReputationCalculator } from './services/reputation-calculator.service';
import { ReputationFactorService } from './services/reputation-factor.service';
export declare class ReputationEngineService {
    private readonly scoreRepository;
    private readonly calculator;
    private readonly factorService;
    private readonly logger;
    constructor(scoreRepository: Repository<ReputationScore>, calculator: ReputationCalculator, factorService: ReputationFactorService);
    recalculateAllScores(): Promise<void>;
    recalculateScore(userId: string, factors?: any[]): Promise<void>;
    getReputationScore(userId: string): Promise<ReputationScore>;
    private getUserData;
}
