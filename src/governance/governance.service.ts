import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { Vote, VoteType } from './entities/vote.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ReputationService } from '../reputation/reputation.service';

@Injectable()
export class GovernanceService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    private reputationService: ReputationService,
  ) {}

  async createProposal(creatorId: string, createProposalDto: CreateProposalDto): Promise<Proposal> {
    const proposal = this.proposalRepository.create({
      ...createProposalDto,
      creatorId,
    });
    return this.proposalRepository.save(proposal);
  }

  async submitVote(userId: string, createVoteDto: CreateVoteDto): Promise<Vote> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: createVoteDto.proposalId },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.status !== ProposalStatus.ACTIVE) {
      throw new BadRequestException('Proposal is not active');
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        proposalId: createVoteDto.proposalId,
        voterId: userId,
      },
    });

    if (existingVote) {
      throw new BadRequestException('User has already voted on this proposal');
    }

    const reputationScore = await this.reputationService.getUserReputationScore(userId);
    const weightedVote = this.calculateWeightedVote(createVoteDto.voteType, reputationScore);

    const vote = this.voteRepository.create({
      ...createVoteDto,
      voterId: userId,
      reputationScore,
      weightedVote,
    });

    return this.voteRepository.save(vote);
  }

  async getProposalResults(proposalId: string) {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId },
      relations: ['votes'],
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const results = {
      totalVotes: proposal.votes.length,
      weightedResults: {
        [VoteType.FOR]: 0,
        [VoteType.AGAINST]: 0,
        [VoteType.ABSTAIN]: 0,
      },
      voterBreakdown: {
        [VoteType.FOR]: [],
        [VoteType.AGAINST]: [],
        [VoteType.ABSTAIN]: [],
      },
    };

    proposal.votes.forEach((vote) => {
      results.weightedResults[vote.voteType] += vote.weightedVote;
      results.voterBreakdown[vote.voteType].push({
        voterId: vote.voterId,
        reputationScore: vote.reputationScore,
        weightedVote: vote.weightedVote,
      });
    });

    return results;
  }

  private calculateWeightedVote(voteType: VoteType, reputationScore: number): number {
    const baseWeight = voteType === VoteType.ABSTAIN ? 0.5 : 1;
    return baseWeight * (reputationScore / 100);
  }

  async closeProposal(proposalId: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    proposal.status = ProposalStatus.CLOSED;
    return this.proposalRepository.save(proposal);
  }
} 