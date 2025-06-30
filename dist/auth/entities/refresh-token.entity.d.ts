import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
export type RefreshTokenDocument = RefreshToken & Document;
export declare class RefreshToken {
    user: User;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    userAgent?: string;
    ipAddress?: string;
}
export declare const RefreshTokenSchema: MongooseSchema<RefreshToken, import("mongoose").Model<RefreshToken, any, any, any, Document<unknown, any, RefreshToken> & RefreshToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RefreshToken, Document<unknown, {}, import("mongoose").FlatRecord<RefreshToken>> & import("mongoose").FlatRecord<RefreshToken> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
