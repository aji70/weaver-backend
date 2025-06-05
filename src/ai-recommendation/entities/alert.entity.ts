import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export enum AlertType {
  BOT_ACTIVITY = 'bot_activity',
  FARMING_DETECTED = 'farming_detected',
  UNUSUAL_PATTERN = 'unusual_pattern',
  SYSTEM_ANOMALY = 'system_anomaly'
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AlertType
  })
  type: AlertType;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.WARNING
  })
  severity: AlertSeverity;

  @Column()
  targetId: string; // userId, campaignId, or system component

  @Column('text')
  description: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column('jsonb')
  metrics: Record<string, number>;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 