export enum NotificationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum NotificationType {
  CAMPAIGN_ALERT = "campaign_alert",
  PROTOCOL_UPDATE = "protocol_update",
  DIRECT_MESSAGE = "direct_message",
  SYSTEM_ALERT = "system_alert",
  REWARD_NOTIFICATION = "reward_notification",
  GOVERNANCE_ALERT = "governance_alert",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}
