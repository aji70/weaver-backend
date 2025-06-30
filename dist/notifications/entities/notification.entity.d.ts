import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    MESSAGE = "MESSAGE",
    TOKEN_TRANSFER = "TOKEN_TRANSFER",
    SYSTEM_ALERT = "SYSTEM_ALERT",
    REPUTATION_UPDATE = "REPUTATION_UPDATE",
    NFT_TRANSFER = "NFT_TRANSFER"
}
export declare class Notification {
    recipient: User;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    metadata: Record<string, any>;
}
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
