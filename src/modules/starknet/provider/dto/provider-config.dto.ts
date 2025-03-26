import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import {
  StarkNetNetwork,
  ProviderType,
} from '../interfaces/provider-options.interface';

export class ProviderConfigDto {
  @IsEnum(StarkNetNetwork)
  network: StarkNetNetwork;

  @IsEnum(ProviderType)
  providerType: ProviderType;

  @IsString()
  @IsOptional()
  nodeUrl?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  retryAttempts?: number;

  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(5000)
  retryDelay?: number;

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(30000)
  timeout?: number;

  @IsBoolean()
  @IsOptional()
  cacheEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cacheTTL?: number;
}
