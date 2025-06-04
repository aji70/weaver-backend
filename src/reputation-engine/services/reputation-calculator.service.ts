import { Injectable, Logger } from '@nestjs/common';
import { ReputationScore, ReputationTier } from '../entities/reputation-score.entity';
import { ReputationFactor } from '../entities/reputation-factor.entity';

@Injectable()
export class ReputationCalculator {
  private readonly logger = new Logger(ReputationCalculator.name);

  private readonly tierThresholds = {
    [ReputationTier.BRONZE]: 0,
    [ReputationTier.SILVER]: 25,
    [ReputationTier.GOLD]: 50,
    [ReputationTier.PLATINUM]: 75,
    [ReputationTier.DIAMOND]: 90,
  };

  calculateScore(factorScores: Record<string, number>, factors: ReputationFactor[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      if (!factor.isActive) continue;

      const score = factorScores[factor.name] || 0;
      const normalizedScore = this.normalizeScore(score, factor.configuration);
      totalScore += normalizedScore * factor.weight;
      totalWeight += factor.weight;
    }

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  }

  determineTier(score: number): ReputationTier {
    const tiers = Object.entries(this.tierThresholds)
      .sort(([, a], [, b]) => b - a);

    for (const [tier, threshold] of tiers) {
      if (score >= threshold) {
        return tier as ReputationTier;
      }
    }

    return ReputationTier.BRONZE;
  }

  private normalizeScore(score: number, config: ReputationFactor['configuration']): number {
    const { minValue, maxValue } = config;
    const range = maxValue - minValue;
    
    if (range <= 0) return 0;
    
    const normalized = (score - minValue) / range;
    return Math.max(0, Math.min(1, normalized));
  }

  calculateFactorScore(
    factor: ReputationFactor,
    userData: Record<string, any>,
  ): number {
    try {
      switch (factor.configuration.calculationMethod) {
        case 'onChainActivity':
          return this.calculateOnChainActivityScore(userData);
        case 'campaignParticipation':
          return this.calculateCampaignParticipationScore(userData);
        case 'accountAge':
          return this.calculateAccountAgeScore(userData);
        case 'kycStatus':
          return this.calculateKycStatusScore(userData);
        default:
          this.logger.warn(`Unknown calculation method: ${factor.configuration.calculationMethod}`);
          return 0;
      }
    } catch (error) {
      this.logger.error(`Error calculating factor score: ${error.message}`);
      return 0;
    }
  }

  private calculateOnChainActivityScore(userData: Record<string, any>): number {
    const { transactions, claims } = userData;
    const transactionScore = Math.min(transactions?.length || 0, 100) / 100;
    const claimScore = Math.min(claims?.length || 0, 50) / 50;
    return (transactionScore + claimScore) / 2;
  }

  private calculateCampaignParticipationScore(userData: Record<string, any>): number {
    const { campaigns } = userData;
    return Math.min(campaigns?.length || 0, 20) / 20;
  }

  private calculateAccountAgeScore(userData: Record<string, any>): number {
    const { accountCreatedAt } = userData;
    if (!accountCreatedAt) return 0;

    const ageInDays = (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(ageInDays / 365, 1); // Max score after 1 year
  }

  private calculateKycStatusScore(userData: Record<string, any>): number {
    const { kycStatus } = userData;
    return kycStatus === 'VERIFIED' ? 1 : 0;
  }
} 