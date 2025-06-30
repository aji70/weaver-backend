import { VoteType } from '../entities/vote.entity';
export declare class CreateVoteDto {
    proposalId: string;
    voteType: VoteType;
    signature: string;
}
