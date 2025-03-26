import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginAttemptDocument = LoginAttempt & Document;

@Schema({ timestamps: true })
export class LoginAttempt {
  @Prop({ required: true })
  address: string; // User's wallet address

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: false })
  isSuccessful: boolean;

  @Prop()
  failureReason?: string;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
