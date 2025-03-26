import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type TokenTransferDocument = TokenTransfer & Document;

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TokenType {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  CUSTOM = 'CUSTOM',
}

@Schema({ timestamps: true })
export class TokenTransfer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ required: true })
  amount: string; // Using string to handle large numbers safely

  @Prop({ required: true })
  tokenAddress: string;

  @Prop({
    type: String,
    enum: TokenType,
    required: true,
  })
  tokenType: TokenType;

  @Prop({ required: true })
  starknetTxHash: string;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  messageId?: string; // Optional reference to a message if the transfer is part of a conversation
}

export const TokenTransferSchema = SchemaFactory.createForClass(TokenTransfer);
