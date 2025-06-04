import { IsString, IsEnum, IsOptional, IsObject, IsDate } from 'class-validator';

export class CreateCampaignMetricDto {
  @IsString()
  campaignId: string;

  @IsEnum(['impression', 'click', 'task_start', 'task_complete'])
  type: 'impression' | 'click' | 'task_start' | 'task_complete';

  @IsString()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsDate()
  @IsOptional()
  timestamp?: Date;
}

export class CampaignMetricResponseDto {
  @IsString()
  campaignId: string;

  @IsEnum(['impression', 'click', 'task_start', 'task_complete'])
  type: 'impression' | 'click' | 'task_start' | 'task_complete';

  @IsString()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsDate()
  timestamp: Date;
} 