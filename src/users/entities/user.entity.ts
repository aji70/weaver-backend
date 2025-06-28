import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Reputation } from '../../reputation/entities/reputation.entity';
import { Nft } from '../../nfts/entities/nft.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 0 })
  reputationScore: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Reputation' }] })
  verifiedActions: Reputation[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Nft' }] })
  ownedNFTs: Nft[];

  @Prop({ default: 0 })
  score: number;
  id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
