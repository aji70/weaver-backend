import { IsBoolean, IsEnum, IsObject, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationPriority, NotificationType } from "../enums/notification.enums"

export class UpdateNotificationPreferencesDto {
  @ApiProperty({
    description: "Enable/disable all notifications",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiProperty({
    description: "Minimum priority level for notifications",
    enum: NotificationPriority,
    example: NotificationPriority.MEDIUM,
    required: false,
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  minimumPriority?: NotificationPriority

  @ApiProperty({
    description: "Preferences for each notification type",
    example: {
      [NotificationType.CAMPAIGN_ALERT]: true,
      [NotificationType.PROTOCOL_UPDATE]: false,
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  typePreferences?: Record<NotificationType, boolean>

  @ApiProperty({
    description: "Quiet hours configuration",
    example: {
      enabled: true,
      startTime: "22:00",
      endTime: "08:00",
      timezone: "UTC",
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  quietHours?: {
    enabled: boolean
    startTime: string
    endTime: string
    timezone: string
  }

  @ApiProperty({
    description: "Delivery settings",
    example: {
      maxDailyNotifications: 50,
      batchDelivery: false,
      batchInterval: 60,
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  deliverySettings?: {
    maxDailyNotifications: number
    batchDelivery: boolean
    batchInterval: number
  }

  @ApiProperty({
    description: "Protocol-specific preferences",
    example: {
      "protocol-123": true,
      "protocol-456": false,
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  protocolPreferences?: Record<string, boolean>

  @ApiProperty({
    description: "Additional metadata",
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>
}
