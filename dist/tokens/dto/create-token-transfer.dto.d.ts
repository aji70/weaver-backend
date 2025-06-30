import { TokenType } from '../entities/token-transfer.entity';
export declare class CreateTokenTransferDto {
    recipient: string;
    amount: string;
    tokenAddress: string;
    tokenType: TokenType;
    messageId?: string;
    metadata?: Record<string, any>;
}
