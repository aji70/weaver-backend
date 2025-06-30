"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const campaign_analytics_controller_1 = require("./campaign-analytics.controller");
const campaign_analytics_service_1 = require("./campaign-analytics.service");
const campaign_metric_schema_1 = require("./schemas/campaign-metric.schema");
const campaign_summary_schema_1 = require("./schemas/campaign-summary.schema");
let CampaignAnalyticsModule = class CampaignAnalyticsModule {
};
exports.CampaignAnalyticsModule = CampaignAnalyticsModule;
exports.CampaignAnalyticsModule = CampaignAnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([
                { name: campaign_metric_schema_1.CampaignMetric.name, schema: campaign_metric_schema_1.CampaignMetricSchema },
                { name: campaign_summary_schema_1.CampaignSummary.name, schema: campaign_summary_schema_1.CampaignSummarySchema },
            ]),
        ],
        controllers: [campaign_analytics_controller_1.CampaignAnalyticsController],
        providers: [campaign_analytics_service_1.CampaignAnalyticsService],
        exports: [campaign_analytics_service_1.CampaignAnalyticsService],
    })
], CampaignAnalyticsModule);
//# sourceMappingURL=campaign-analytics.module.js.map