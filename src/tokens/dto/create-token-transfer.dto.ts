import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
  IsMongoId,
} from 'class-validator';
import { TokenType } from '../entities/token-transfer.entity';

export class CreateTokenTransferDto {
  @IsMongoId()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @IsEnum(TokenType)
  @IsNotEmpty()
  tokenType: TokenType;

  @IsString()
  @IsOptional()
  messageId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
