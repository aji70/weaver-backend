import { Vote } from './vote.entity';
export declare enum ProposalStatus {
    ACTIVE = "active",
    CLOSED = "closed",
    CANCELLED = "cancelled",
    EXECUTED = "EXECUTED"
}
export declare class Proposal {
    id: string;
    title: string;
    description: string;
    status: ProposalStatus;
    creatorId: string;
    startDate: Date;
    endDate: Date;
    votes: Vote[];
    createdAt: Date;
    updatedAt: Date;
    finalOutcome: boolean;
}
