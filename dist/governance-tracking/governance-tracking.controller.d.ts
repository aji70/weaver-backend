import { GovernanceTrackingService } from './governance-tracking.service';
export declare class GovernanceTrackingController {
    private readonly trackingService;
    constructor(trackingService: GovernanceTrackingService);
    getUserActivity(id: number): Promise<{
        reputation: number;
        totalVotes: number;
        totalWeight: number;
        influenceRate: number;
        proposalsParticipated: {
            proposalId: string;
            title: string;
            status: import("../governance/entities/proposal.entity").ProposalStatus;
            vote: string;
            outcome: boolean;
        }[];
    }>;
    getProtocolStats(id: number): Promise<{
        protocolId: number;
        protocolName: string;
        proposalCount: number;
        proposalPassed: number;
        passRate: number;
        voterCount: number;
        avgTurnout: number;
    }>;
}
