import { RewardDistributionService } from './reward-distribution.service';
import { AssignRewardDto } from './dto/assign-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';
import { RewardStatus } from './entities/reward.entity';
import { ClaimStatus } from './entities/reward-claim.entity';
export declare class RewardDistributionController {
    private readonly rewardDistributionService;
    constructor(rewardDistributionService: RewardDistributionService);
    assignReward(assignRewardDto: AssignRewardDto): Promise<import("./entities/reward.entity").Reward>;
    claimReward(req: any, claimRewardDto: ClaimRewardDto): Promise<import("./entities/reward-claim.entity").RewardClaim>;
    getUserRewardHistory(userId: string, status?: RewardStatus): Promise<import("./entities/reward.entity").Reward[]>;
    getRewardClaims(rewardId: string, status?: ClaimStatus): Promise<import("./entities/reward-claim.entity").RewardClaim[]>;
    batchProcessClaims(body: {
        claimIds: string[];
    }): Promise<{
        message: string;
    }>;
}
