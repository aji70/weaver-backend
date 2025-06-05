import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignMetricDocument = CampaignMetric & Document;

@Schema({ timestamps: true })
export class CampaignMetric {
  @Prop({ required: true })
  campaignId: string;

  @Prop({ required: true })
  type: 'impression' | 'click' | 'task_start' | 'task_complete';

  @Prop()
  userId?: string;

  @Prop()
  metadata?: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;
}

export const CampaignMetricSchema = SchemaFactory.createForClass(CampaignMetric); 