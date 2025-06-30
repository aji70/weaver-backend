import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
export type ReputationDocument = Reputation & Document;
export declare enum VerificationStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare class Reputation {
    user: User;
    action: string;
    points: number;
    proof: string;
    verificationStatus: VerificationStatus;
    verifiedAt: Date;
    verifiedBy: User;
    organization: Organization;
}
export declare const ReputationSchema: MongooseSchema<Reputation, import("mongoose").Model<Reputation, any, any, any, Document<unknown, any, Reputation> & Reputation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reputation, Document<unknown, {}, import("mongoose").FlatRecord<Reputation>> & import("mongoose").FlatRecord<Reputation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
