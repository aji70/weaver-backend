import { ReputationEngineService } from './reputation-engine.service';
import { ReputationScore } from './entities/reputation-score.entity';
export declare class ReputationEngineController {
    private readonly reputationService;
    constructor(reputationService: ReputationEngineService);
    getReputationScore(userId: string): Promise<ReputationScore>;
    recalculateScore(userId: string): Promise<ReputationScore>;
}
