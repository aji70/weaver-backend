import { ReputationTier } from '../entities/reputation-score.entity';
import { ReputationFactor } from '../entities/reputation-factor.entity';
export declare class ReputationCalculator {
    private readonly logger;
    private readonly tierThresholds;
    calculateScore(factorScores: Record<string, number>, factors: ReputationFactor[]): number;
    determineTier(score: number): ReputationTier;
    private normalizeScore;
    calculateFactorScore(factor: ReputationFactor, userData: Record<string, any>): number;
    private calculateOnChainActivityScore;
    private calculateCampaignParticipationScore;
    private calculateAccountAgeScore;
    private calculateKycStatusScore;
}
