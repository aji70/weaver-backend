import { Job } from 'bull';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Reward } from '../entities/reward.entity';
import { RewardClaim } from '../entities/reward-claim.entity';
export declare class RewardProcessor {
    private rewardRepository;
    private claimRepository;
    private configService;
    private readonly logger;
    private readonly provider;
    private readonly wallet;
    constructor(rewardRepository: Repository<Reward>, claimRepository: Repository<RewardClaim>, configService: ConfigService);
    handleClaim(job: Job<{
        claimId: string;
    }>): Promise<void>;
    private processTransfer;
    handleBatchClaims(job: Job<{
        claimIds: string[];
    }>): Promise<void>;
}
