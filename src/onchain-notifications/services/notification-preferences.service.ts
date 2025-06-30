import { Injectable, Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import { NotificationPreferences } from "../entities/notification-preferences.entity"
import { UpdateNotificationPreferencesDto } from "../dto/update-notification-preferences.dto"
import { NotificationPriority, NotificationType } from "../enums/notification.enums"

@Injectable()
export class NotificationPreferencesService {
  private readonly logger = new Logger(NotificationPreferencesService.name)

  constructor(private preferencesRepository: Repository<NotificationPreferences>) {}

  async getUserPreferences(userAddress: string): Promise<NotificationPreferences> {
    let preferences = await this.preferencesRepository.findOne({
      where: { userAddress },
    })

    if (!preferences) {
      preferences = await this.createDefaultPreferences(userAddress)
    }

    return preferences
  }

  async updatePreferences(
    userAddress: string,
    updateDto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferences> {
    let preferences = await this.preferencesRepository.findOne({
      where: { userAddress },
    })

    if (!preferences) {
      preferences = await this.createDefaultPreferences(userAddress)
    }

    // Update preferences
    Object.assign(preferences, updateDto)
    preferences.updatedAt = new Date()

    return this.preferencesRepository.save(preferences)
  }

  async deletePreferences(userAddress: string): Promise<void> {
    await this.preferencesRepository.delete({ userAddress })
  }

  async isNotificationAllowed(
    userAddress: string,
    notificationType: NotificationType,
    priority: NotificationPriority,
  ): Promise<boolean> {
    const preferences = await this.getUserPreferences(userAddress)

    if (!preferences.enabled) {
      return false
    }

    // Check type-specific preferences
    const typePreference = preferences.typePreferences?.[notificationType]
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

    const notificationPriorityValue = priorityValues[priority]
    const minPriorityValue = priorityValues[preferences.minimumPriority]

    return notificationPriorityValue >= minPriorityValue
  }

  private async createDefaultPreferences(userAddress: string): Promise<NotificationPreferences> {
    const defaultPreferences = this.preferencesRepository.create({
      userAddress,
      enabled: true,
      minimumPriority: NotificationPriority.LOW,
      typePreferences: {
        [NotificationType.CAMPAIGN_ALERT]: true,
        [NotificationType.PROTOCOL_UPDATE]: true,
        [NotificationType.DIRECT_MESSAGE]: true,
        [NotificationType.SYSTEM_ALERT]: true,
        [NotificationType.REWARD_NOTIFICATION]: true,
        [NotificationType.GOVERNANCE_ALERT]: true,
      },
      quietHours: {
        enabled: false,
        startTime: "22:00",
        endTime: "08:00",
        timezone: "UTC",
      },
      deliverySettings: {
        maxDailyNotifications: 50,
        batchDelivery: false,
        batchInterval: 60, // minutes
      },
    })

    return this.preferencesRepository.save(defaultPreferences)
  }
}
