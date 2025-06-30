"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRecommendationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const recommendation_entity_1 = require("./entities/recommendation.entity");
const alert_entity_1 = require("./entities/alert.entity");
let AiRecommendationService = class AiRecommendationService {
    recommendationRepository;
    alertRepository;
    recommendationsQueue;
    constructor(recommendationRepository, alertRepository, recommendationsQueue) {
        this.recommendationRepository = recommendationRepository;
        this.alertRepository = alertRepository;
        this.recommendationsQueue = recommendationsQueue;
    }
    async getCampaignRecommendations(campaignId) {
        const recommendations = await this.recommendationRepository.find({
            where: {
                targetId: campaignId,
                type: recommendation_entity_1.RecommendationType.CAMPAIGN_OPTIMIZATION,
            },
            order: {
                createdAt: 'DESC',
            },
        });
        if (!recommendations.length) {
            await this.recommendationsQueue.add('analyze-campaign', { campaignId });
        }
        return recommendations;
    }
    async getAlerts(type, severity, resolved) {
        const query = this.alertRepository.createQueryBuilder('alert');
        if (type) {
            query.andWhere('alert.type = :type', { type });
        }
        if (severity) {
            query.andWhere('alert.severity = :severity', { severity });
        }
        if (typeof resolved === 'boolean') {
            query.andWhere('alert.isResolved = :resolved', { resolved });
        }
        return query.orderBy('alert.createdAt', 'DESC').getMany();
    }
    async markRecommendationAsRead(id) {
        const recommendation = await this.recommendationRepository.findOne({
            where: { id },
        });
        if (!recommendation) {
            throw new common_1.NotFoundException('Recommendation not found');
        }
        recommendation.isRead = true;
        return this.recommendationRepository.save(recommendation);
    }
    async markRecommendationAsApplied(id) {
        const recommendation = await this.recommendationRepository.findOne({
            where: { id },
        });
        if (!recommendation) {
            throw new common_1.NotFoundException('Recommendation not found');
        }
        recommendation.isApplied = true;
        return this.recommendationRepository.save(recommendation);
    }
    async resolveAlert(id) {
        const alert = await this.alertRepository.findOne({
            where: { id },
        });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        alert.isResolved = true;
        alert.resolvedAt = new Date();
        return this.alertRepository.save(alert);
    }
    async triggerUserAnalysis(userId) {
        await this.recommendationsQueue.add('analyze-user', { userId });
    }
    async triggerCampaignAnalysis(campaignId) {
        await this.recommendationsQueue.add('analyze-campaign', { campaignId });
    }
};
exports.AiRecommendationService = AiRecommendationService;
exports.AiRecommendationService = AiRecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recommendation_entity_1.Recommendation)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(2, (0, bull_1.InjectQueue)('recommendations')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object])
], AiRecommendationService);
//# sourceMappingURL=ai-recommendation.service.js.map