import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CampaignTemplate } from './campaign-template.entity';

export enum RuleType {
  ELIGIBILITY = 'eligibility',
  COMPLETION = 'completion',
  REWARD = 'reward',
  CUSTOM = 'custom'
}

@Entity('campaign_rules')
export class CampaignRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateId: string;

  @ManyToOne(() => CampaignTemplate, template => template.rules)
  @JoinColumn({ name: 'templateId' })
  template: CampaignTemplate;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: RuleType,
    default: RuleType.ELIGIBILITY
  })
  type: RuleType;

  @Column('jsonb')
  conditions: {
    operator: 'AND' | 'OR';
    rules: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };

  @Column('jsonb', { nullable: true })
  actions: {
    type: string;
    params: Record<string, any>;
  }[];

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
} 