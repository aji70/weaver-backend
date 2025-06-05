import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignSummaryDocument = CampaignSummary & Document;

@Schema({ timestamps: true })
export class CampaignSummary {
  @Prop({ required: true })
  campaignId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, default: 0 })
  impressions: number;

  @Prop({ required: true, default: 0 })
  clicks: number;

  @Prop({ required: true, default: 0 })
  taskStarts: number;

  @Prop({ required: true, default: 0 })
  taskCompletions: number;

  @Prop({ required: true, default: 0 })
  cost: number;

  @Prop({ required: true, default: 0 })
  revenue: number;

  @Prop()
  ctr: number;

  @Prop()
  conversionRate: number;

  @Prop()
  roi: number;

  @Prop()
  cpa: number;
}

export const CampaignSummarySchema = SchemaFactory.createForClass(CampaignSummary);

// Create compound index for efficient querying
CampaignSummarySchema.index({ campaignId: 1, date: 1 }, { unique: true }); 