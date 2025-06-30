"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReputationCalculator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationCalculator = void 0;
const common_1 = require("@nestjs/common");
const reputation_score_entity_1 = require("../entities/reputation-score.entity");
let ReputationCalculator = ReputationCalculator_1 = class ReputationCalculator {
    logger = new common_1.Logger(ReputationCalculator_1.name);
    tierThresholds = {
        [reputation_score_entity_1.ReputationTier.BRONZE]: 0,
        [reputation_score_entity_1.ReputationTier.SILVER]: 25,
        [reputation_score_entity_1.ReputationTier.GOLD]: 50,
        [reputation_score_entity_1.ReputationTier.PLATINUM]: 75,
        [reputation_score_entity_1.ReputationTier.DIAMOND]: 90,
    };
    calculateScore(factorScores, factors) {
        let totalScore = 0;
        let totalWeight = 0;
        for (const factor of factors) {
            if (!factor.isActive)
                continue;
            const score = factorScores[factor.name] || 0;
            const normalizedScore = this.normalizeScore(score, factor.configuration);
            totalScore += normalizedScore * factor.weight;
            totalWeight += factor.weight;
        }
        return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
    }
    determineTier(score) {
        const tiers = Object.entries(this.tierThresholds)
            .sort(([, a], [, b]) => b - a);
        for (const [tier, threshold] of tiers) {
            if (score >= threshold) {
                return tier;
            }
        }
        return reputation_score_entity_1.ReputationTier.BRONZE;
    }
    normalizeScore(score, config) {
        const { minValue, maxValue } = config;
        const range = maxValue - minValue;
        if (range <= 0)
            return 0;
        const normalized = (score - minValue) / range;
        return Math.max(0, Math.min(1, normalized));
    }
    calculateFactorScore(factor, userData) {
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
        }
        catch (error) {
            this.logger.error(`Error calculating factor score: ${error.message}`);
            return 0;
        }
    }
    calculateOnChainActivityScore(userData) {
        const { transactions, claims } = userData;
        const transactionScore = Math.min(transactions?.length || 0, 100) / 100;
        const claimScore = Math.min(claims?.length || 0, 50) / 50;
        return (transactionScore + claimScore) / 2;
    }
    calculateCampaignParticipationScore(userData) {
        const { campaigns } = userData;
        return Math.min(campaigns?.length || 0, 20) / 20;
    }
    calculateAccountAgeScore(userData) {
        const { accountCreatedAt } = userData;
        if (!accountCreatedAt)
            return 0;
        const ageInDays = (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
        return Math.min(ageInDays / 365, 1);
    }
    calculateKycStatusScore(userData) {
        const { kycStatus } = userData;
        return kycStatus === 'VERIFIED' ? 1 : 0;
    }
};
exports.ReputationCalculator = ReputationCalculator;
exports.ReputationCalculator = ReputationCalculator = ReputationCalculator_1 = __decorate([
    (0, common_1.Injectable)()
], ReputationCalculator);
//# sourceMappingURL=reputation-calculator.service.js.map