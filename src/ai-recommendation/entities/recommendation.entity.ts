import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RecommendationType {
  CAMPAIGN_OPTIMIZATION = 'campaign_optimization',
  USER_RETENTION = 'user_retention',
  ANOMALY_DETECTION = 'anomaly_detection'
}

export enum RecommendationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RecommendationType
  })
  type: RecommendationType;

  @Column({
    type: 'enum',
    enum: RecommendationPriority,
    default: RecommendationPriority.MEDIUM
  })
  priority: RecommendationPriority;

  @Column()
  targetId: string; // campaignId or userId

  @Column('text')
  description: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column('jsonb')
  metrics: Record<string, number>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isApplied: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 