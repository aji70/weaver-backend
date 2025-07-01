import { IsString, IsNotEmpty, IsEnum, IsObject } from 'class-validator';

export class CreateCohortDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEnum(['whale', 'new_joiner', 'dormant', 'custom'])
  type: string;

  @IsObject()
  criteria: Record<string, any>;
}
