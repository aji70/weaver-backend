import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proposal } from './proposal.entity';

export enum VoteType {
  FOR = 'for',
  AGAINST = 'against',
  ABSTAIN = 'abstain',
}

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  voterId: string;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;

  @Column('decimal', { precision: 5, scale: 2 })
  reputationScore: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weightedVote: number;

  @Column()
  proposalId: string;

  @ManyToOne(() => Proposal, (proposal) => proposal.votes)
  @JoinColumn({ name: 'proposalId' })
  proposal: Proposal;

  @Column({ type: 'text' })
  signature: string;

  @CreateDateColumn()
  createdAt: Date;
  weight: number;
  choice: any;
  voter: any;
}
