import { IsOptional, IsString, IsEnum, IsObject } from 'class-validator';

export class QueryCohortDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['whale', 'new_joiner', 'dormant', 'custom'])
  type?: string;

  @IsOptional()
  @IsObject()
  criteria?: Record<string, any>;
}
