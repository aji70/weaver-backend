import { Document } from 'mongoose';
export type CampaignSummaryDocument = CampaignSummary & Document;
export declare class CampaignSummary {
    campaignId: string;
    date: Date;
    impressions: number;
    clicks: number;
    taskStarts: number;
    taskCompletions: number;
    cost: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
    roi: number;
    cpa: number;
}
export declare const CampaignSummarySchema: import("mongoose").Schema<CampaignSummary, import("mongoose").Model<CampaignSummary, any, any, any, Document<unknown, any, CampaignSummary> & CampaignSummary & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CampaignSummary, Document<unknown, {}, import("mongoose").FlatRecord<CampaignSummary>> & import("mongoose").FlatRecord<CampaignSummary> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
