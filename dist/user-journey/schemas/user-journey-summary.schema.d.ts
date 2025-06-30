import { Document } from 'mongoose';
export type UserJourneySummaryDocument = UserJourneySummary & Document;
export declare class UserJourneySummary {
    userId: string;
    date: Date;
    sessionCount: number;
    totalActions: number;
    actionTypeCounts: Map<string, number>;
    actionNameCounts: Map<string, number>;
    actionDurations: Map<string, number>;
    successRates: Map<string, number>;
    commonFlows: Map<string, string[]>;
    dropOffPoints: Map<string, number>;
    averageSessionDuration: number;
    completionRate: number;
    metadata?: Record<string, any>;
}
export declare const UserJourneySummarySchema: import("mongoose").Schema<UserJourneySummary, import("mongoose").Model<UserJourneySummary, any, any, any, Document<unknown, any, UserJourneySummary> & UserJourneySummary & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserJourneySummary, Document<unknown, {}, import("mongoose").FlatRecord<UserJourneySummary>> & import("mongoose").FlatRecord<UserJourneySummary> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
