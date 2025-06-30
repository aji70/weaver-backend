import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Vote } from 'src/governance/entities/vote.entity';
import { Proposal } from 'src/governance/entities/proposal.entity';
import { Protocol } from 'src/governance/entities/protocol.entity';
import { ProposalStatus } from 'src/governance/entities/proposal.entity';
export declare class GovernanceTrackingService {
    private readonly userRepo;
    private readonly voteRepo;
    private readonly proposalRepo;
    private readonly protocolRepo;
    constructor(userRepo: Repository<User>, voteRepo: Repository<Vote>, proposalRepo: Repository<Proposal>, protocolRepo: Repository<Protocol>);
    getUserGovernanceStats(userId: number): Promise<{
        reputation: number;
        totalVotes: number;
        totalWeight: number;
        influenceRate: number;
        proposalsParticipated: {
            proposalId: string;
            title: string;
            status: ProposalStatus;
            vote: string;
            outcome: boolean;
        }[];
    }>;
    getProtocolAnalytics(protocolId: number): Promise<{
        protocolId: number;
        protocolName: string;
        proposalCount: number;
        proposalPassed: number;
        passRate: number;
        voterCount: number;
        avgTurnout: number;
    }>;
}
