import { Proposal } from './proposal.entity';
export declare enum VoteType {
    FOR = "for",
    AGAINST = "against",
    ABSTAIN = "abstain"
}
export declare class Vote {
    id: string;
    voterId: string;
    voteType: VoteType;
    reputationScore: number;
    weightedVote: number;
    proposalId: string;
    proposal: Proposal;
    signature: string;
    createdAt: Date;
    weight: number;
    choice: any;
    voter: any;
}
