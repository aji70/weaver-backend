import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RewardClaim } from './reward-claim.entity';

export enum TokenType {
  ERC20 = 'erc20',
  NATIVE = 'native'
}

export enum RewardStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  CLAIMED = 'claimed',
  CANCELLED = 'cancelled'
}

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 36, scale: 18 })
  amount: string;

  @Column({
    type: 'enum',
    enum: TokenType,
    default: TokenType.ERC20
  })
  tokenType: TokenType;

  @Column({ nullable: true })
  tokenAddress: string;

  @Column({
    type: 'enum',
    enum: RewardStatus,
    default: RewardStatus.PENDING
  })
  status: RewardStatus;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ nullable: true })
  transactionHash: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => RewardClaim, claim => claim.reward)
  claims: RewardClaim[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 