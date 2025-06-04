import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ReputationTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

@Entity('reputation_scores')
export class ReputationScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @Column({
    type: 'enum',
    enum: ReputationTier,
    default: ReputationTier.BRONZE,
  })
  tier: ReputationTier;

  @Column('jsonb')
  factorScores: {
    onChainActivity: number;
    campaignParticipation: number;
    accountAge: number;
    kycStatus: number;
    [key: string]: number;
  };

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastCalculatedAt: Date;
} 