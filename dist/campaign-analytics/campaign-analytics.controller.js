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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const campaign_analytics_service_1 = require("./campaign-analytics.service");
const campaign_metric_dto_1 = require("./dto/campaign-metric.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CampaignAnalyticsController = class CampaignAnalyticsController {
    campaignAnalyticsService;
    constructor(campaignAnalyticsService) {
        this.campaignAnalyticsService = campaignAnalyticsService;
    }
    async trackMetric(campaignId, createMetricDto) {
        createMetricDto.campaignId = campaignId;
        return this.campaignAnalyticsService.trackMetric(createMetricDto);
    }
    async getCampaignMetrics(campaignId, startDate, endDate) {
        return this.campaignAnalyticsService.getCampaignMetrics(campaignId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getCampaignSummary(campaignId, date) {
        return this.campaignAnalyticsService.getCampaignSummary(campaignId, date ? new Date(date) : undefined);
    }
};
exports.CampaignAnalyticsController = CampaignAnalyticsController;
__decorate([
    (0, common_1.Post)(':campaignId/metrics'),
    __param(0, (0, common_1.Param)('campaignId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, campaign_metric_dto_1.CreateCampaignMetricDto]),
    __metadata("design:returntype", Promise)
], CampaignAnalyticsController.prototype, "trackMetric", null);
__decorate([
    (0, common_1.Get)(':campaignId'),
    __param(0, (0, common_1.Param)('campaignId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CampaignAnalyticsController.prototype, "getCampaignMetrics", null);
__decorate([
    (0, common_1.Get)(':campaignId/summary'),
    __param(0, (0, common_1.Param)('campaignId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CampaignAnalyticsController.prototype, "getCampaignSummary", null);
exports.CampaignAnalyticsController = CampaignAnalyticsController = __decorate([
    (0, common_1.Controller)('analytics/campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [campaign_analytics_service_1.CampaignAnalyticsService])
], CampaignAnalyticsController);
//# sourceMappingURL=campaign-analytics.controller.js.map