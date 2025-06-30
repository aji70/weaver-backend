import { Document, Schema as MongooseSchema } from 'mongoose';
import { Reputation } from '../../reputation/entities/reputation.entity';
import { Nft } from '../../nfts/entities/nft.entity';
export type UserDocument = User & Document;
export declare class User {
    address: string;
    username: string;
    reputationScore: number;
    verifiedActions: Reputation[];
    ownedNFTs: Nft[];
    score: number;
    id: any;
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
