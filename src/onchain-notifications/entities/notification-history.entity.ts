import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"
import { NotificationStatus, NotificationType } from "../enums/notification.enums"

@Entity("notification_history")
export class NotificationHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userAddress: string

  @Column()
  @Index()
  notificationId: string

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType

  @Column({
    type: "enum",
    enum: NotificationStatus,
  })
  status: NotificationStatus

  @Column({ nullable: true })
  transactionHash?: string

  @Column({ nullable: true })
  gasUsed?: string

  @Column({ nullable: true })
  errorMessage?: string

  @Column()
  @Index()
  timestamp: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
