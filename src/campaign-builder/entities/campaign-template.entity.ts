import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CampaignMilestone } from './campaign-milestone.entity';
import { CampaignRule } from './campaign-rule.entity';

export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('campaign_templates')
export class CampaignTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT,
  })
  status: TemplateStatus;

  @Column('jsonb')
  rewardStructure: {
    type: string;
    amount: number;
    tokenAddress?: string;
    distributionRules: Record<string, any>;
  };

  @Column('jsonb', { nullable: true })
  targetingRules: {
    userTypes: string[];
    minReputation?: number;
    requiredNfts?: string[];
    kycRequirements?: {
      required: boolean;
      provider?: 'world_id' | 'privado_id' | 'hypersign';
      verificationLevel?: 'device' | 'orb' | 'basic' | 'full_kyc';
    };
    customConditions?: Record<string, any>;
  };

  @OneToMany(() => CampaignMilestone, (milestone) => milestone.template)
  milestones: CampaignMilestone[];

  @OneToMany(() => CampaignRule, (rule) => rule.template)
  rules: CampaignRule[];

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
