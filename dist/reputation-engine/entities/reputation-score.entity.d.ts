export declare enum ReputationTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND"
}
export declare class ReputationScore {
    id: string;
    userId: string;
    score: number;
    tier: ReputationTier;
    factorScores: {
        onChainActivity: number;
        campaignParticipation: number;
        accountAge: number;
        kycStatus: number;
        [key: string]: number;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    lastCalculatedAt: Date;
}
