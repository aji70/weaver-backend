export declare enum RecommendationType {
    CAMPAIGN_OPTIMIZATION = "campaign_optimization",
    USER_RETENTION = "user_retention",
    ANOMALY_DETECTION = "anomaly_detection"
}
export declare enum RecommendationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class Recommendation {
    id: string;
    type: RecommendationType;
    priority: RecommendationPriority;
    targetId: string;
    description: string;
    data: Record<string, any>;
    metrics: Record<string, number>;
    isRead: boolean;
    isApplied: boolean;
    createdAt: Date;
    updatedAt: Date;
}
