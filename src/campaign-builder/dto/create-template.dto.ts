import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateStatus } from '../entities/campaign-template.entity';
import { MilestoneType } from '../entities/campaign-milestone.entity';
import { RuleType } from '../entities/campaign-rule.entity';

class RewardStructureDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  tokenAddress?: string;

  @IsObject()
  distributionRules: Record<string, any>;
}

class TargetingRulesDto {
  @IsArray()
  @IsString({ each: true })
  userTypes: string[];

  @IsNumber()
  @IsOptional()
  minReputation?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredNfts?: string[];

  @IsObject()
  @IsOptional()
  customConditions?: Record<string, any>;
}

class MilestoneDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(MilestoneType)
  type: MilestoneType;

  @IsObject()
  requirements: {
    taskId?: string;
    duration?: number;
    achievementId?: string;
    customCondition?: Record<string, any>;
  };

  @IsObject()
  rewards: {
    type: string;
    amount: number;
    tokenAddress?: string;
  };

  @IsNumber()
  @Min(0)
  order: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

class RuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(RuleType)
  type: RuleType;

  @IsObject()
  conditions: {
    operator: 'AND' | 'OR';
    rules: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  actions?: {
    type: string;
    params: Record<string, any>;
  }[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TemplateStatus)
  @IsOptional()
  status?: TemplateStatus;

  @IsObject()
  @ValidateNested()
  @Type(() => RewardStructureDto)
  rewardStructure: RewardStructureDto;

  @IsObject()
  @ValidateNested()
  @Type(() => TargetingRulesDto)
  @IsOptional()
  targetingRules?: TargetingRulesDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  milestones: MilestoneDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleDto)
  rules: RuleDto[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 