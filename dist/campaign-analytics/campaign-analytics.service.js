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
exports.CampaignAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const campaign_metric_schema_1 = require("./schemas/campaign-metric.schema");
const campaign_summary_schema_1 = require("./schemas/campaign-summary.schema");
let CampaignAnalyticsService = class CampaignAnalyticsService {
    campaignMetricModel;
    campaignSummaryModel;
    constructor(campaignMetricModel, campaignSummaryModel) {
        this.campaignMetricModel = campaignMetricModel;
        this.campaignSummaryModel = campaignSummaryModel;
    }
    async trackMetric(createMetricDto) {
        const metric = new this.campaignMetricModel({
            ...createMetricDto,
            timestamp: createMetricDto.timestamp || new Date(),
        });
        return metric.save();
    }
    async getCampaignMetrics(campaignId, startDate, endDate) {
        const query = { campaignId };
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate)
                query.timestamp.$gte = startDate;
            if (endDate)
                query.timestamp.$lte = endDate;
        }
        return this.campaignMetricModel.find(query).sort({ timestamp: -1 }).exec();
    }
    async getCampaignSummary(campaignId, date) {
        const queryDate = date || new Date();
        queryDate.setHours(0, 0, 0, 0);
        return this.campaignSummaryModel.findOne({
            campaignId,
            date: queryDate,
        }).exec();
    }
    async aggregateDailyMetrics() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const metrics = await this.campaignMetricModel.find({
            timestamp: {
                $gte: yesterday,
                $lt: today,
            },
        }).exec();
        const campaignSummaries = new Map();
        for (const metric of metrics) {
            if (!campaignSummaries.has(metric.campaignId)) {
                campaignSummaries.set(metric.campaignId, {
                    campaignId: metric.campaignId,
                    date: yesterday,
                    impressions: 0,
                    clicks: 0,
                    taskStarts: 0,
                    taskCompletions: 0,
                    cost: 0,
                    revenue: 0,
                });
            }
            const summary = campaignSummaries.get(metric.campaignId);
            switch (metric.type) {
                case 'impression':
                    summary.impressions++;
                    break;
                case 'click':
                    summary.clicks++;
                    break;
                case 'task_start':
                    summary.taskStarts++;
                    break;
                case 'task_complete':
                    summary.taskCompletions++;
                    break;
            }
        }
        for (const summary of campaignSummaries.values()) {
            summary.ctr = summary.impressions > 0 ? (summary.clicks / summary.impressions) * 100 : 0;
            summary.conversionRate = summary.taskStarts > 0 ? (summary.taskCompletions / summary.taskStarts) * 100 : 0;
            summary.roi = summary.cost > 0 ? ((summary.revenue - summary.cost) / summary.cost) * 100 : 0;
            summary.cpa = summary.taskCompletions > 0 ? summary.cost / summary.taskCompletions : 0;
            await this.campaignSummaryModel.findOneAndUpdate({ campaignId: summary.campaignId, date: summary.date }, summary, { upsert: true, new: true });
        }
    }
};
exports.CampaignAnalyticsService = CampaignAnalyticsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignAnalyticsService.prototype, "aggregateDailyMetrics", null);
exports.CampaignAnalyticsService = CampaignAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaign_metric_schema_1.CampaignMetric.name)),
    __param(1, (0, mongoose_1.InjectModel)(campaign_summary_schema_1.CampaignSummary.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CampaignAnalyticsService);
//# sourceMappingURL=campaign-analytics.service.js.map