import { GovernanceService } from './governance.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
export declare class GovernanceController {
    private readonly governanceService;
    constructor(governanceService: GovernanceService);
    createProposal(req: any, createProposalDto: CreateProposalDto): Promise<import("./entities/proposal.entity").Proposal>;
    submitVote(req: any, createVoteDto: CreateVoteDto): Promise<import("./entities/vote.entity").Vote>;
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
    closeProposal(proposalId: string): Promise<import("./entities/proposal.entity").Proposal>;
}
