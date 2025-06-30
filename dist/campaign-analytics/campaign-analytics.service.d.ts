import { Model } from 'mongoose';
import { CampaignMetric, CampaignMetricDocument } from './schemas/campaign-metric.schema';
import { CampaignSummary, CampaignSummaryDocument } from './schemas/campaign-summary.schema';
import { CreateCampaignMetricDto } from './dto/campaign-metric.dto';
export declare class CampaignAnalyticsService {
    private campaignMetricModel;
    private campaignSummaryModel;
    constructor(campaignMetricModel: Model<CampaignMetricDocument>, campaignSummaryModel: Model<CampaignSummaryDocument>);
    trackMetric(createMetricDto: CreateCampaignMetricDto): Promise<CampaignMetric>;
    getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date): Promise<(import("mongoose").Document<unknown, {}, CampaignMetricDocument> & CampaignMetric & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getCampaignSummary(campaignId: string, date?: Date): Promise<(import("mongoose").Document<unknown, {}, CampaignSummaryDocument> & CampaignSummary & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    aggregateDailyMetrics(): Promise<void>;
}
