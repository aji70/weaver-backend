/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Vote } from 'src/governance/entities/vote.entity';
import { Proposal } from 'src/governance/entities/proposal.entity';
import { Protocol } from 'src/governance/entities/protocol.entity';
import { ProposalStatus } from 'src/governance/entities/proposal.entity';

@Injectable()
export class GovernanceTrackingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,

    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,

    @InjectRepository(Protocol)
    private readonly protocolRepo: Repository<Protocol>,
  ) {}

  async getUserGovernanceStats(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const votes = await this.voteRepo.find({
      where: { voter: { id: userId } },
      relations: ['proposal'],
    });

    const totalWeight = votes.reduce((sum, vote) => sum + vote.weight, 0);

    const alignedVotes = votes.filter(
      (vote) =>
        vote.proposal?.finalOutcome &&
        vote.choice === vote.proposal.finalOutcome,
    );

    const influenceRate =
      votes.length > 0 ? alignedVotes.length / votes.length : 0;

    return {
      reputation: user.reputationScore,
      totalVotes: votes.length,
      totalWeight,
      influenceRate: parseFloat(influenceRate.toFixed(2)),
      proposalsParticipated: votes.map((vote: Vote) => ({
        proposalId: vote.proposal.id,
        title: vote.proposal.title,
        status: vote.proposal.status,
        vote: vote.choice as string,
        outcome: vote.proposal.finalOutcome ?? 'N/A',
      })),
    };
  }

  async getProtocolAnalytics(protocolId: number) {
    const protocol: Protocol | null = await this.protocolRepo.findOne({
      where: { id: protocolId },
    });

    if (!protocol) throw new NotFoundException('Protocol not found');

    const proposals = await this.proposalRepo.find({
      where: { id: protocolId.toString() },
      relations: ['votes', 'votes.voter'],
    });

    const total = proposals.length;
    const passed = proposals.filter(
      (p) => p.status === ProposalStatus.EXECUTED,
    ).length;

    const allVotes = proposals.flatMap((p) => p.votes);
    const uniqueVoters = new Set(
      allVotes
        .map((v: Vote): number | undefined => {
          const voter = v.voter as User | undefined;
          return voter && typeof voter.id === 'number' ? voter.id : undefined;
        })
        .filter((id): id is number => typeof id === 'number'),
    ).size;

    const avgTurnout = total > 0 ? allVotes.length / total : 0;

    return {
      protocolId,
      protocolName: protocol.name,
      proposalCount: total,
      proposalPassed: passed,
      passRate: total > 0 ? parseFloat((passed / total).toFixed(2)) : 0,
      voterCount: uniqueVoters,
      avgTurnout: parseFloat(avgTurnout.toFixed(2)),
    };
  }
}
