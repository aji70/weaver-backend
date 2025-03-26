import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  TOKEN_TRANSFER = 'TOKEN_TRANSFER',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  REPUTATION_UPDATE = 'REPUTATION_UPDATE',
  NFT_TRANSFER = 'NFT_TRANSFER',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
