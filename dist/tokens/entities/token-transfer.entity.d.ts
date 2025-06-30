import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
export type TokenTransferDocument = TokenTransfer & Document;
export declare enum TransactionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum TokenType {
    ETH = "ETH",
    ERC20 = "ERC20",
    CUSTOM = "CUSTOM"
}
export declare class TokenTransfer {
    sender: User;
    recipient: User;
    amount: string;
    tokenAddress: string;
    tokenType: TokenType;
    starknetTxHash: string;
    status: TransactionStatus;
    metadata: Record<string, any>;
    messageId?: string;
}
export declare const TokenTransferSchema: MongooseSchema<TokenTransfer, import("mongoose").Model<TokenTransfer, any, any, any, Document<unknown, any, TokenTransfer> & TokenTransfer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TokenTransfer, Document<unknown, {}, import("mongoose").FlatRecord<TokenTransfer>> & import("mongoose").FlatRecord<TokenTransfer> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
