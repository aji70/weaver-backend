import { Document } from 'mongoose';
export type CampaignMetricDocument = CampaignMetric & Document;
export declare class CampaignMetric {
    campaignId: string;
    type: 'impression' | 'click' | 'task_start' | 'task_complete';
    userId?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
export declare const CampaignMetricSchema: import("mongoose").Schema<CampaignMetric, import("mongoose").Model<CampaignMetric, any, any, any, Document<unknown, any, CampaignMetric> & CampaignMetric & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CampaignMetric, Document<unknown, {}, import("mongoose").FlatRecord<CampaignMetric>> & import("mongoose").FlatRecord<CampaignMetric> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
