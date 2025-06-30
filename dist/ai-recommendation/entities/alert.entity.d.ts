export declare enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical"
}
export declare enum AlertType {
    BOT_ACTIVITY = "bot_activity",
    FARMING_DETECTED = "farming_detected",
    UNUSUAL_PATTERN = "unusual_pattern",
    SYSTEM_ANOMALY = "system_anomaly"
}
export declare class Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    targetId: string;
    description: string;
    data: Record<string, any>;
    metrics: Record<string, number>;
    isResolved: boolean;
    resolvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
