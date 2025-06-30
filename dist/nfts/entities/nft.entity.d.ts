import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
export type NftDocument = Nft & Document;
declare class Attribute {
    trait_type: string;
    value: string;
}
declare class Metadata {
    name: string;
    description: string;
    image: string;
    attributes: Attribute[];
}
export declare class Nft {
    tokenId: string;
    contractAddress: string;
    metadata: Metadata;
    organization: Organization;
    owner: User;
}
export declare const NftSchema: MongooseSchema<Nft, import("mongoose").Model<Nft, any, any, any, Document<unknown, any, Nft> & Nft & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Nft, Document<unknown, {}, import("mongoose").FlatRecord<Nft>> & import("mongoose").FlatRecord<Nft> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
