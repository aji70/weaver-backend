import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum ProtocolEventType {
  REWARD_CLAIM = 'REWARD_CLAIM',
  TOKEN_TRANSFER = 'TOKEN_TRANSFER',
  NFT_MINT = 'NFT_MINT',
}

@Entity('protocol_events')
export class ProtocolEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  protocolId: string;

  @Column({
    type: 'enum',
    enum: ProtocolEventType,
  })
  eventType: ProtocolEventType;

  @Column('jsonb')
  payload: Record<string, any>;

  @Column()
  blockNumber: number;

  @Column()
  transactionHash: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: false })
  processed: boolean;

  @Column({ nullable: true })
  error?: string;
} 