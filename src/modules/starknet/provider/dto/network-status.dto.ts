import {
  IsBoolean,
  IsNumber,
  IsString,
  IsDate,
  IsObject,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NetworkInfo } from '../interfaces/network-info.interface';
import { StarkNetNetwork } from '../interfaces/provider-options.interface';

export class NetworkStatusDto {
  @IsBoolean()
  isConnected: boolean;

  @IsNumber()
  latency: number;

  @IsObject()
  @ValidateNested()
  @Type(() => NetworkInfoDto)
  @IsOptional()
  networkInfo?: NetworkInfo;

  @IsString()
  @IsOptional()
  lastError?: string;

  @IsDate()
  lastSync: Date;

  @IsString()
  providerUrl: string;
}

export class NetworkInfoDto implements NetworkInfo {
  @IsString()
  chainId: string;

  @IsEnum(StarkNetNetwork)
  network: StarkNetNetwork;

  @IsNumber()
  blockNumber: number;

  @IsString()
  blockHash: string;

  @IsString()
  @IsOptional()
  gasPrice?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SyncStatusDto)
  syncStatus: {
    starting: number;
    current: number;
    highest: number;
    syncing: boolean;
  };
}

export class SyncStatusDto {
  @IsNumber()
  starting: number;

  @IsNumber()
  current: number;

  @IsNumber()
  highest: number;

  @IsBoolean()
  syncing: boolean;
}
