import { TokenType } from '../entities/reward.entity';
export declare class AssignRewardDto {
    campaignId: string;
    userId: string;
    amount: number;
    tokenType: TokenType;
    tokenAddress?: string;
    walletAddress?: string;
    metadata?: Record<string, any>;
}
