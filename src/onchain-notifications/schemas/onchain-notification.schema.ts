import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { NotificationPriority, NotificationStatus, NotificationType } from "../enums/notification.enums"

export type OnchainNotificationDocument = OnchainNotification & Document

@Schema({ timestamps: true })
export class OnchainNotification {
  @Prop({ required: true })
  recipientAddress: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  message: string

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type: NotificationType

  @Prop({
    type: String,
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority

  @Prop({
    type: String,
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus

  @Prop()
  senderAddress?: string

  @Prop()
  protocolId?: string

  @Prop()
  campaignId?: string

  @Prop({ type: Object })
  metadata?: Record<string, any>

  @Prop()
  scheduledFor?: Date

  @Prop()
  transactionHash?: string

  @Prop()
  gasUsed?: string

  @Prop({ default: 0 })
  attempts: number

  @Prop()
  lastAttemptAt?: Date

  @Prop()
  deliveredAt?: Date

  @Prop()
  errorMessage?: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop()
  updatedAt?: Date
}

export const OnchainNotificationSchema = SchemaFactory.createForClass(OnchainNotification)

// Create indexes for efficient querying
OnchainNotificationSchema.index({ recipientAddress: 1, createdAt: -1 })
OnchainNotificationSchema.index({ status: 1, createdAt: -1 })
OnchainNotificationSchema.index({ type: 1, createdAt: -1 })
OnchainNotificationSchema.index({ protocolId: 1, createdAt: -1 })
OnchainNotificationSchema.index({ campaignId: 1, createdAt: -1 })
OnchainNotificationSchema.index({ scheduledFor: 1 })
