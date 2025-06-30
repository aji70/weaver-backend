import { Reward } from './reward.entity';
export declare enum ClaimStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class RewardClaim {
    id: string;
    rewardId: string;
    reward: Reward;
    userId: string;
    walletAddress: string;
    status: ClaimStatus;
    transactionHash: string;
    error: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    processedAt: Date;
    completedAt: Date;
}
