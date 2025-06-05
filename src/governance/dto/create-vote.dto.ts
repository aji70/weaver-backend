import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { VoteType } from '../entities/vote.entity';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  proposalId: string;

  @IsEnum(VoteType)
  @IsNotEmpty()
  voteType: VoteType;

  @IsString()
  @IsNotEmpty()
  signature: string;
} 