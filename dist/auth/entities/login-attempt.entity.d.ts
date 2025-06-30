import { Document } from 'mongoose';
export type LoginAttemptDocument = LoginAttempt & Document;
export declare class LoginAttempt {
    address: string;
    ipAddress: string;
    userAgent?: string;
    isSuccessful: boolean;
    failureReason?: string;
}
export declare const LoginAttemptSchema: import("mongoose").Schema<LoginAttempt, import("mongoose").Model<LoginAttempt, any, any, any, Document<unknown, any, LoginAttempt> & LoginAttempt & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LoginAttempt, Document<unknown, {}, import("mongoose").FlatRecord<LoginAttempt>> & import("mongoose").FlatRecord<LoginAttempt> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
