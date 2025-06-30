import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from "@nestjs/bull"
import type { Job } from "bull"
import { Injectable, Logger } from "@nestjs/common"
import type { Model } from "mongoose"
import type { StarknetMessagingService } from "../services/starknet-messaging.service"
import type { NotificationHistoryService } from "../services/notification-history.service"
import { OnchainNotificationDocument } from "../schemas/onchain-notification.schema"
import { NotificationStatus } from "../enums/notification.enums"

@Injectable()
export class NotificationQueueProcessor {
  private readonly logger = new Logger(NotificationQueueProcessor.name)

  constructor(
    private notificationModel: Model<OnchainNotificationDocument>,
    private starknetMessagingService: StarknetMessagingService,
    private historyService: NotificationHistoryService,
  ) {}

  @Processor("onchain-notifications")
  process() {}

  @Process("send-onchain-notification")
  async handleSendNotification(job: Job<{ notificationId: string }>) {
    const { notificationId } = job.data

    try {
      const notification = await this.notificationModel.findById(notificationId)
      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`)
      }

      if (notification.status !== NotificationStatus.PENDING) {
        this.logger.warn(`Notification ${notificationId} is not in pending status`)
        return
      }

      // Update status to processing
      notification.status = NotificationStatus.PROCESSING
      notification.attempts += 1
      notification.lastAttemptAt = new Date()
      await notification.save()

      // Send onchain message
      const result = await this.starknetMessagingService.sendOnchainMessage(notification)

      if (result.success) {
        // Update notification status
        notification.status = NotificationStatus.DELIVERED
        notification.transactionHash = result.transactionHash
        notification.gasUsed = result.gasUsed
        notification.deliveredAt = new Date()
        await notification.save()

        // Record in history
        await this.historyService.recordNotification(
          notification.recipientAddress,
          notification._id.toString(),
          notification.type,
          NotificationStatus.DELIVERED,
          result.transactionHash,
          result.gasUsed,
        )

        this.logger.log(`Notification ${notificationId} delivered successfully`)
      } else {
        throw new Error("Failed to send onchain message")
      }
    } catch (error) {
      this.logger.error(`Failed to process notification ${notificationId}: ${error.message}`, error.stack)

      // Update notification with error
      const notification = await this.notificationModel.findById(notificationId)
      if (notification) {
        notification.status = NotificationStatus.FAILED
        notification.errorMessage = error.message
        await notification.save()

        // Record failure in history
        await this.historyService.recordNotification(
          notification.recipientAddress,
          notification._id.toString(),
          notification.type,
          NotificationStatus.FAILED,
          undefined,
          undefined,
          error.message,
        )
      }

      throw error
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing notification job ${job.id} of type ${job.name}`)
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Completed notification job ${job.id} of type ${job.name}`)
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Failed notification job ${job.id} of type ${job.name}: ${err.message}`, err.stack)
  }
}
