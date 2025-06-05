import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reward } from './reward.entity';

export enum ClaimStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('reward_claims')
export class RewardClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rewardId: string;

  @ManyToOne(() => Reward, reward => reward.claims)
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  @Column()
  userId: string;

  @Column()
  walletAddress: string;

  @Column({
    type: 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.PENDING
  })
  status: ClaimStatus;

  @Column({ nullable: true })
  transactionHash: string;

  @Column('jsonb', { nullable: true })
  error: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
} 