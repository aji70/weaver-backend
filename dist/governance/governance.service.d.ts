import { Repository } from 'typeorm';
import { Proposal } from './entities/proposal.entity';
import { Vote } from './entities/vote.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ReputationService } from '../reputation/reputation.service';
export declare class GovernanceService {
    private proposalRepository;
    private voteRepository;
    private reputationService;
    constructor(proposalRepository: Repository<Proposal>, voteRepository: Repository<Vote>, reputationService: ReputationService);
    createProposal(creatorId: string, createProposalDto: CreateProposalDto): Promise<Proposal>;
    submitVote(userId: string, createVoteDto: CreateVoteDto): Promise<Vote>;
    getProposalResults(proposalId: string): Promise<{
        totalVotes: number;
        weightedResults: {
            for: number;
            against: number;
            abstain: number;
        };
        voterBreakdown: {
            for: never[];
            against: never[];
            abstain: never[];
        };
    }>;
    private calculateWeightedVote;
    closeProposal(proposalId: string): Promise<Proposal>;
}
