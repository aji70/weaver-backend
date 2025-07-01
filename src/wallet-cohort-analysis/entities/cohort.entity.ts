import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CohortDocument = Cohort & Document;

@Schema({ timestamps: true })
export class Cohort {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['whale', 'new_joiner', 'dormant', 'custom'] })
  type: string;

  @Prop({ type: Object, required: true })
  criteria: Record<string, any>; // JSON object describing cohort rules

  @Prop({ type: [String], default: [] })
  members: string[]; // Array of wallet addresses
}

export const CohortSchema = SchemaFactory.createForClass(Cohort);
