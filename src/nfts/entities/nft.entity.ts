import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

export type NftDocument = Nft & Document;

class Attribute {
  @Prop()
  trait_type: string;

  @Prop()
  value: string;
}

class Metadata {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: [Attribute] })
  attributes: Attribute[];
}

@Schema({ timestamps: true })
export class Nft {
  @Prop({ required: true, unique: true })
  tokenId: string;

  @Prop({ required: true })
  contractAddress: string;

  @Prop({ type: Metadata })
  metadata: Metadata;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization: Organization;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
