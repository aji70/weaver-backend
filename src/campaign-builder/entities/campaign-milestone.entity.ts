import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CampaignTemplate } from './campaign-template.entity';

export enum MilestoneType {
  TASK = 'task',
  TIME = 'time',
  ACHIEVEMENT = 'achievement',
  CUSTOM = 'custom'
}

@Entity('campaign_milestones')
export class CampaignMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateId: string;

  @ManyToOne(() => CampaignTemplate, template => template.milestones)
  @JoinColumn({ name: 'templateId' })
  template: CampaignTemplate;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: MilestoneType,
    default: MilestoneType.TASK
  })
  type: MilestoneType;

  @Column('jsonb')
  requirements: {
    taskId?: string;
    duration?: number;
    achievementId?: string;
    customCondition?: Record<string, any>;
  };

  @Column('jsonb')
  rewards: {
    type: string;
    amount: number;
    tokenAddress?: string;
  };

  @Column({ default: 0 })
  order: number;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
} 