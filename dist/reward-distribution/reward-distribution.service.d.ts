import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Reward, RewardStatus } from './entities/reward.entity';
import { RewardClaim, ClaimStatus } from './entities/reward-claim.entity';
import { AssignRewardDto } from './dto/assign-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';
export declare class RewardDistributionService {
    private rewardRepository;
    private claimRepository;
    private rewardsQueue;
    constructor(rewardRepository: Repository<Reward>, claimRepository: Repository<RewardClaim>, rewardsQueue: Queue);
    assignReward(assignRewardDto: AssignRewardDto): Promise<Reward>;
    claimReward(userId: string, claimRewardDto: ClaimRewardDto): Promise<RewardClaim>;
    getUserRewardHistory(userId: string, status?: RewardStatus): Promise<Reward[]>;
    getRewardClaims(rewardId: string, status?: ClaimStatus): Promise<RewardClaim[]>;
    batchProcessClaims(claimIds: string[]): Promise<void>;
}
