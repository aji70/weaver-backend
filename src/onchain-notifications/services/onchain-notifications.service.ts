import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common"
import { Model } from "mongoose"
import { Queue } from "bull"
import { OnchainNotificationDocument } from "../schemas/onchain-notification.schema"
import { StarknetMessagingService } from "./starknet-messaging.service"
import { NotificationPreferencesService } from "./notification-preferences.service"
import { NotificationHistoryService } from "./notification-history.service"
import { CreateOnchainNotificationDto } from "../dto/create-onchain-notification.dto"
import { OnchainNotification } from "../entities/onchain-notification.entity"
import { NotificationPriority, NotificationStatus } from "../enums/notification.enums"
import { UpdateNotificationPreferencesDto } from "../dto/update-notification-preferences.dto"


@Injectable()
export class OnchainNotificationsService {
  private readonly logger = new Logger(OnchainNotificationsService.name)

  constructor(
    private notificationModel: Model<OnchainNotificationDocument>,
    private notificationQueue: Queue,
    private starknetMessagingService: StarknetMessagingService,
    private preferencesService: NotificationPreferencesService,
    private historyService: NotificationHistoryService,
  ) {}

  async sendNotification(createNotificationDto: CreateOnchainNotificationDto): Promise<OnchainNotification> {
    try {
      // Validate recipient address
      if (!this.isValidStarknetAddress(createNotificationDto.recipientAddress)) {
        throw new BadRequestException("Invalid Starknet address format")
      }

      // Check user preferences
      const preferences = await this.preferencesService.getUserPreferences(createNotificationDto.recipientAddress)

      if (!this.shouldSendNotification(createNotificationDto, preferences)) {
        this.logger.log(`Notification blocked by user preferences for ${createNotificationDto.recipientAddress}`)
        throw new BadRequestException("Notification blocked by user preferences")
      }

      // Create notification record
      const notification = new this.notificationModel({
        ...createNotificationDto,
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        attempts: 0,
      })

      const savedNotification = await notification.save()

      // Queue for onchain delivery
      await this.queueNotification(savedNotification)

      this.logger.log(`Notification queued for delivery: ${savedNotification._id}`)
      return savedNotification
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack)
      throw error
    }
  }

  async batchSendNotifications(notifications: CreateOnchainNotificationDto[]): Promise<{
    successful: string[]
    failed: { notification: CreateOnchainNotificationDto; error: string }[]
  }> {
    const results: {
      successful: string[]
      failed: { notification: CreateOnchainNotificationDto; error: string }[]
    } = {
      successful: [],
      failed: [],
    }

    for (const notificationDto of notifications) {
      try {
        const notification = await this.sendNotification(notificationDto)
        results.successful.push(notification.id.toString())
      } catch (error) {
        results.failed.push({
          notification: notificationDto,
          error: error.message,
        })
      }
    }

    return results
  }

  async getNotificationStatus(notificationId: string): Promise<OnchainNotification> {
    const notification = await this.notificationModel.findById(notificationId)
    if (!notification) {
      throw new NotFoundException("Notification not found")
    }
    return notification
  }

  async getUserNotifications(
    userAddress: string,
    options: {
      status?: NotificationStatus
      type?: NotificationType
      limit?: number
      offset?: number
    } = {},
  ): Promise<{
    notifications: OnchainNotification[]
    total: number
  }> {
    const query: any = { recipientAddress: userAddress }

    if (options.status) {
      query.status = options.status
    }

    if (options.type) {
      query.type = options.type
    }

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(options.limit || 20)
        .skip(options.offset || 0)
        .exec(),
      this.notificationModel.countDocuments(query),
    ])

    return { notifications, total }
  }

  async updateNotificationPreferences(
    userAddress: string,
    preferences: UpdateNotificationPreferencesDto,
  ): Promise<void> {
    await this.preferencesService.updatePreferences(userAddress, preferences)
  }

  async getUserPreferences(userAddress: string) {
    return this.preferencesService.getUserPreferences(userAddress)
  }

  async getNotificationHistory(
    userAddress: string,
    options: {
      startDate?: Date
      endDate?: Date
      limit?: number
      offset?: number
    } = {},
  ) {
    return this.historyService.getUserHistory(userAddress, options)
  }

  async retryFailedNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationModel.findById(notificationId)
    if (!notification) {
      throw new NotFoundException("Notification not found")
    }

    if (notification.status !== NotificationStatus.FAILED) {
      throw new BadRequestException("Only failed notifications can be retried")
    }

    notification.status = NotificationStatus.PENDING
    notification.attempts = 0
    notification.lastAttemptAt = undefined
    notification.errorMessage = undefined

    await notification.save()
    await this.queueNotification(notification)
  }

  async cancelNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationModel.findById(notificationId)
    if (!notification) {
      throw new NotFoundException("Notification not found")
    }

    if (notification.status === NotificationStatus.DELIVERED) {
      throw new BadRequestException("Cannot cancel delivered notification")
    }

    notification.status = NotificationStatus.CANCELLED
    await notification.save()

    // Remove from queue if pending
    await this.notificationQueue.removeJobs(`notification-${notificationId}`)
  }

  private async queueNotification(notification: OnchainNotification): Promise<void> {
    const delay = this.calculateDelay(notification.priority, notification.scheduledFor)

    await this.notificationQueue.add(
      "send-onchain-notification",
      {
        notificationId: notification._id.toString(),
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        jobId: `notification-${notification._id}`,
      },
    )
  }

  private shouldSendNotification(notification: CreateOnchainNotificationDto, preferences: any): boolean {
    if (!preferences.enabled) {
      return false
    }

    // Check type-specific preferences
    const typePreference = preferences.typePreferences?.[notification.type]
    if (typePreference !== undefined && !typePreference) {
      return false
    }

    // Check priority threshold
    const priorityValues = {
      [NotificationPriority.LOW]: 1,
      [NotificationPriority.MEDIUM]: 2,
      [NotificationPriority.HIGH]: 3,
      [NotificationPriority.URGENT]: 4,
    }

    const notificationPriorityValue = priorityValues[notification.priority]
    const minPriorityValue = priorityValues[preferences.minimumPriority] || 1

    return notificationPriorityValue >= minPriorityValue
  }

  private calculateDelay(priority: NotificationPriority, scheduledFor?: Date): number {
    if (scheduledFor) {
      const now = new Date()
      const delay = scheduledFor.getTime() - now.getTime()
      return Math.max(0, delay)
    }

    // Immediate delivery for high priority
    if (priority === NotificationPriority.URGENT || priority === NotificationPriority.HIGH) {
      return 0
    }

    // Small delay for medium priority
    if (priority === NotificationPriority.MEDIUM) {
      return 5000 // 5 seconds
    }

    // Longer delay for low priority
    return 30000 // 30 seconds
  }

  private isValidStarknetAddress(address: string): boolean {
    // Starknet addresses are 64-character hex strings (with or without 0x prefix)
    const addressRegex = /^(0x)?[0-9a-fA-F]{64}$/
    return addressRegex.test(address)
  }
}
