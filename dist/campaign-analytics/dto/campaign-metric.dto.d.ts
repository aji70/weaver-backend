export declare class CreateCampaignMetricDto {
    campaignId: string;
    type: 'impression' | 'click' | 'task_start' | 'task_complete';
    userId?: string;
    metadata?: Record<string, any>;
    timestamp?: Date;
}
export declare class CampaignMetricResponseDto {
    campaignId: string;
    type: 'impression' | 'click' | 'task_start' | 'task_complete';
    userId?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
