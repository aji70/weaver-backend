import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"
import { NotificationPriority, NotificationType } from "../enums/notification.enums"

@Entity("notification_preferences")
export class NotificationPreferences {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userAddress: string

  @Column({ default: true })
  enabled: boolean

  @Column({
    type: "enum",
    enum: NotificationPriority,
    default: NotificationPriority.LOW,
  })
  minimumPriority: NotificationPriority

  @Column("jsonb")
  typePreferences: Record<NotificationType, boolean>

  @Column("jsonb")
  quietHours: {
    enabled: boolean
    startTime: string // HH:MM format
    endTime: string // HH:MM format
    timezone: string
  }

  @Column("jsonb")
  deliverySettings: {
    maxDailyNotifications: number
    batchDelivery: boolean
    batchInterval: number // minutes
  }

  @Column("jsonb", { nullable: true })
  protocolPreferences?: Record<string, boolean> // protocolId -> enabled

  @Column("jsonb", { nullable: true })
  metadata?: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
