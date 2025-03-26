import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

export type ReputationDocument = Reputation & Document;

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Reputation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  proof: string;

  @Prop({
    type: String,
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Prop()
  verifiedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  verifiedBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const ReputationSchema = SchemaFactory.createForClass(Reputation);
