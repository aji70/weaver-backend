import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsDateString, MaxLength, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationPriority, NotificationType } from "../enums/notification.enums"

export class CreateOnchainNotificationDto {
  @ApiProperty({
    description: "Recipient Starknet address",
    example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/, {
    message: "Invalid Starknet address format",
  })
  recipientAddress: string

  @ApiProperty({
    description: "Notification title",
    example: "Campaign Alert",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @ApiProperty({
    description: "Notification message content",
    example: "Your campaign has reached 1000 participants!",
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string

  @ApiProperty({
    description: "Type of notification",
    enum: NotificationType,
    example: NotificationType.CAMPAIGN_ALERT,
  })
  @IsEnum(NotificationType)
  type: NotificationType

  @ApiProperty({
    description: "Notification priority",
    enum: NotificationPriority,
    example: NotificationPriority.MEDIUM,
    required: false,
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority

  @ApiProperty({
    description: "Sender address (optional)",
    example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^(0x)?[0-9a-fA-F]{64}$/, {
    message: "Invalid Starknet address format",
  })
  senderAddress?: string

  @ApiProperty({
    description: "Protocol ID (for protocol-related notifications)",
    example: "protocol-123",
    required: false,
  })
  @IsString()
  @IsOptional()
  protocolId?: string

  @ApiProperty({
    description: "Campaign ID (for campaign-related notifications)",
    example: "campaign-456",
    required: false,
  })
  @IsString()
  @IsOptional()
  campaignId?: string

  @ApiProperty({
    description: "Additional metadata",
    example: { actionUrl: "https://app.example.com/campaign/123" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>

  @ApiProperty({
    description: "Scheduled delivery time (ISO string)",
    example: "2024-01-15T10:00:00Z",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  scheduledFor?: Date
}
