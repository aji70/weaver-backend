import { IsString, IsOptional, IsObject, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CreateUserJourneyEventDto {
  @IsString()
  userId: string;

  @IsString()
  sessionId: string;

  @IsString()
  actionType: string;

  @IsString()
  actionName: string;

  @IsObject()
  @IsOptional()
  actionData?: Record<string, any>;

  @IsDate()
  @IsOptional()
  timestamp?: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  previousAction?: string;

  @IsString()
  @IsOptional()
  nextAction?: string;

  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UserJourneyEventResponseDto {
  @IsString()
  userId: string;

  @IsString()
  sessionId: string;

  @IsString()
  actionType: string;

  @IsString()
  actionName: string;

  @IsObject()
  @IsOptional()
  actionData?: Record<string, any>;

  @IsDate()
  timestamp: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  previousAction?: string;

  @IsString()
  @IsOptional()
  nextAction?: string;

  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UserJourneySummaryResponseDto {
  @IsString()
  userId: string;

  @IsDate()
  date: Date;

  @IsNumber()
  sessionCount: number;

  @IsNumber()
  totalActions: number;

  @IsObject()
  actionTypeCounts: Record<string, number>;

  @IsObject()
  actionNameCounts: Record<string, number>;

  @IsObject()
  actionDurations: Record<string, number>;

  @IsObject()
  successRates: Record<string, number>;

  @IsObject()
  commonFlows: Record<string, string[]>;

  @IsObject()
  dropOffPoints: Record<string, number>;

  @IsNumber()
  averageSessionDuration: number;

  @IsNumber()
  completionRate: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 