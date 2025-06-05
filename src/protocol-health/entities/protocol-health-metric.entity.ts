import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('protocol_health_metrics')
export class ProtocolHealthMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  protocolId: string;

  @Column('decimal', { precision: 36, scale: 18 })
  tvl: number;

  @Column('decimal', { precision: 36, scale: 18 })
  dailyTransactionVolume: number;

  @Column('decimal', { precision: 36, scale: 18 })
  weeklyTransactionVolume: number;

  @Column('decimal', { precision: 36, scale: 18 })
  walletGrowthRate: number;

  @Column('decimal', { precision: 5, scale: 2 })
  healthScore: number;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
} 