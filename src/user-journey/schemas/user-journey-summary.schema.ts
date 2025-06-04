import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserJourneySummaryDocument = UserJourneySummary & Document;

@Schema({ timestamps: true })
export class UserJourneySummary {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  sessionCount: number;

  @Prop({ required: true })
  totalActions: number;

  @Prop({ type: Map, of: Number })
  actionTypeCounts: Map<string, number>;

  @Prop({ type: Map, of: Number })
  actionNameCounts: Map<string, number>;

  @Prop({ type: Map, of: Number })
  actionDurations: Map<string, number>;

  @Prop({ type: Map, of: Number })
  successRates: Map<string, number>;

  @Prop({ type: Map, of: [String] })
  commonFlows: Map<string, string[]>;

  @Prop({ type: Map, of: Number })
  dropOffPoints: Map<string, number>;

  @Prop()
  averageSessionDuration: number;

  @Prop()
  completionRate: number;

  @Prop()
  metadata?: Record<string, any>;
}

export const UserJourneySummarySchema = SchemaFactory.createForClass(UserJourneySummary);

// Create compound index for efficient querying
UserJourneySummarySchema.index({ userId: 1, date: 1 }, { unique: true }); 