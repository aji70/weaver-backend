import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ClaimRewardDto {
  @IsString()
  @IsNotEmpty()
  rewardId: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsOptional()
  metadata?: Record<string, any>;
} 