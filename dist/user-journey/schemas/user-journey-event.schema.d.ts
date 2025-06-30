import { Document } from 'mongoose';
export type UserJourneyEventDocument = UserJourneyEvent & Document;
export declare class UserJourneyEvent {
    userId: string;
    sessionId: string;
    actionType: string;
    actionName: string;
    actionData?: Record<string, any>;
    timestamp: Date;
    duration?: number;
    previousAction?: string;
    nextAction?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
export declare const UserJourneyEventSchema: import("mongoose").Schema<UserJourneyEvent, import("mongoose").Model<UserJourneyEvent, any, any, any, Document<unknown, any, UserJourneyEvent> & UserJourneyEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserJourneyEvent, Document<unknown, {}, import("mongoose").FlatRecord<UserJourneyEvent>> & import("mongoose").FlatRecord<UserJourneyEvent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
