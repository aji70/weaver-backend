import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Nft } from '../../nfts/entities/nft.entity';

export type OrganizationDocument = Organization & Document;

class SocialLinks {
  @Prop()
  website: string;

  @Prop()
  twitter: string;

  @Prop()
  discord: string;

  @Prop()
  telegram: string;
}

export enum OrganizationTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    type: String,
    enum: OrganizationTier,
    default: OrganizationTier.BRONZE,
  })
  tier: OrganizationTier;

  @Prop({ type: SocialLinks })
  socialLinks: SocialLinks;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Nft' }] })
  nftRewards: Nft[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
