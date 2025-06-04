import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserJourneyEventDocument = UserJourneyEvent & Document;

@Schema({ timestamps: true })
export class UserJourneyEvent {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  actionType: string;

  @Prop({ required: true })
  actionName: string;

  @Prop()
  actionData?: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  duration?: number;

  @Prop()
  previousAction?: string;

  @Prop()
  nextAction?: string;

  @Prop()
  success?: boolean;

  @Prop()
  errorMessage?: string;

  @Prop()
  metadata?: Record<string, any>;
}

export const UserJourneyEventSchema = SchemaFactory.createForClass(UserJourneyEvent);

// Create indexes for efficient querying
UserJourneyEventSchema.index({ userId: 1, timestamp: -1 });
UserJourneyEventSchema.index({ sessionId: 1, timestamp: -1 });
UserJourneyEventSchema.index({ actionType: 1, timestamp: -1 }); 