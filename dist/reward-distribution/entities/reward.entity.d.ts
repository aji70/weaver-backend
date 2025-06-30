import { RewardClaim } from './reward-claim.entity';
export declare enum TokenType {
    ERC20 = "erc20",
    NATIVE = "native"
}
export declare enum RewardStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    CLAIMED = "claimed",
    CANCELLED = "cancelled"
}
export declare class Reward {
    id: string;
    campaignId: string;
    userId: string;
    amount: string;
    tokenType: TokenType;
    tokenAddress: string;
    status: RewardStatus;
    walletAddress: string;
    transactionHash: string;
    metadata: Record<string, any>;
    claims: RewardClaim[];
    createdAt: Date;
    updatedAt: Date;
}
