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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recommendation_entity_1 = require("../entities/recommendation.entity");
const alert_entity_1 = require("../entities/alert.entity");
const analytics_service_1 = require("../../x-analytics/analytics.service");
let RecommendationProcessor = class RecommendationProcessor {
    recommendationRepository;
    alertRepository;
    analyticsService;
    constructor(recommendationRepository, alertRepository, analyticsService) {
        this.recommendationRepository = recommendationRepository;
        this.alertRepository = alertRepository;
        this.analyticsService = analyticsService;
    }
    async handleCampaignAnalysis(job) {
        const { campaignId } = job.data;
        const campaignMetrics = await this.analyticsService.getCampaignMetrics(campaignId);
        const recommendations = await this.analyzeCampaignPerformance(campaignId, campaignMetrics);
        await this.recommendationRepository.save(recommendations);
        const alerts = await this.detectCampaignAnomalies(campaignId, campaignMetrics);
        if (alerts.length > 0) {
            await this.alertRepository.save(alerts);
        }
    }
    async handleUserAnalysis(job) {
        const { userId } = job.data;
        const userMetrics = await this.analyticsService.getUserMetrics(userId);
        const recommendations = await this.analyzeUserBehavior(userId, userMetrics);
        await this.recommendationRepository.save(recommendations);
        const alerts = await this.detectUserAnomalies(userId, userMetrics);
        if (alerts.length > 0) {
            await this.alertRepository.save(alerts);
        }
    }
    async analyzeCampaignPerformance(campaignId, metrics) {
        const recommendations = [];
        if (metrics.engagementRate < 0.1) {
            recommendations.push({
                type: recommendation_entity_1.RecommendationType.CAMPAIGN_OPTIMIZATION,
                targetId: campaignId,
                description: 'Low engagement rate detected. Consider adjusting campaign timing or rewards.',
                data: {
                    currentEngagementRate: metrics.engagementRate,
                    suggestedActions: ['Adjust timing', 'Increase rewards', 'Target different audience'],
                },
                metrics: {
                    engagementRate: metrics.engagementRate,
                    threshold: 0.1,
                },
            });
        }
        return recommendations;
    }
    async analyzeUserBehavior(userId, metrics) {
        const recommendations = [];
        if (metrics.activityDrop > 0.5) {
            recommendations.push({
                type: recommendation_entity_1.RecommendationType.USER_RETENTION,
                targetId: userId,
                description: 'User showing signs of disengagement. Consider retention strategies.',
                data: {
                    activityDrop: metrics.activityDrop,
                    suggestedActions: ['Send personalized message', 'Offer incentives', 'Check for issues'],
                },
                metrics: {
                    activityDrop: metrics.activityDrop,
                    threshold: 0.5,
                },
            });
        }
        return recommendations;
    }
    async detectCampaignAnomalies(campaignId, metrics) {
        const alerts = [];
        if (metrics.suspiciousActivity > 0.8) {
            alerts.push({
                type: alert_entity_1.AlertType.FARMING_DETECTED,
                severity: AlertSeverity.CRITICAL,
                targetId: campaignId,
                description: 'High level of suspicious activity detected in campaign.',
                data: {
                    suspiciousActivity: metrics.suspiciousActivity,
                    affectedUsers: metrics.suspiciousUsers,
                },
                metrics: {
                    suspiciousActivity: metrics.suspiciousActivity,
                    threshold: 0.8,
                },
            });
        }
        return alerts;
    }
    async detectUserAnomalies(userId, metrics) {
        const alerts = [];
        if (metrics.botProbability > 0.9) {
            alerts.push({
                type: alert_entity_1.AlertType.BOT_ACTIVITY,
                severity: AlertSeverity.CRITICAL,
                targetId: userId,
                description: 'Bot-like behavior detected.',
                data: {
                    botProbability: metrics.botProbability,
                    suspiciousPatterns: metrics.suspiciousPatterns,
                },
                metrics: {
                    botProbability: metrics.botProbability,
                    threshold: 0.9,
                },
            });
        }
        return alerts;
    }
};
exports.RecommendationProcessor = RecommendationProcessor;
__decorate([
    (0, bull_1.Process)('analyze-campaign'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], RecommendationProcessor.prototype, "handleCampaignAnalysis", null);
__decorate([
    (0, bull_1.Process)('analyze-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], RecommendationProcessor.prototype, "handleUserAnalysis", null);
exports.RecommendationProcessor = RecommendationProcessor = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('recommendations'),
    __param(0, (0, typeorm_1.InjectRepository)(recommendation_entity_1.Recommendation)),
    __param(1, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], RecommendationProcessor);
//# sourceMappingURL=recommendation.processor.js.map