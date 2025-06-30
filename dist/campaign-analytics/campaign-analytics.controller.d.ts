import { CampaignAnalyticsService } from './campaign-analytics.service';
import { CreateCampaignMetricDto, CampaignMetricResponseDto } from './dto/campaign-metric.dto';
export declare class CampaignAnalyticsController {
    private readonly campaignAnalyticsService;
    constructor(campaignAnalyticsService: CampaignAnalyticsService);
    trackMetric(campaignId: string, createMetricDto: CreateCampaignMetricDto): Promise<CampaignMetricResponseDto>;
    getCampaignMetrics(campaignId: string, startDate?: string, endDate?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/campaign-metric.schema").CampaignMetricDocument> & import("./schemas/campaign-metric.schema").CampaignMetric & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getCampaignSummary(campaignId: string, date?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/campaign-summary.schema").CampaignSummaryDocument> & import("./schemas/campaign-summary.schema").CampaignSummary & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
