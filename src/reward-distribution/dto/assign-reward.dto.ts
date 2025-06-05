import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { TokenType } from '../entities/reward.entity';

export class AssignRewardDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(TokenType)
  @IsNotEmpty()
  tokenType: TokenType;

  @IsString()
  @IsOptional()
  tokenAddress?: string;

  @IsString()
  @IsOptional()
  walletAddress?: string;

  @IsOptional()
  metadata?: Record<string, any>;
} 