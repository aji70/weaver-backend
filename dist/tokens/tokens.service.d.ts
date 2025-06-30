import { Model } from 'mongoose';
import { CreateTokenTransferDto } from './dto/create-token-transfer.dto';
import { TokenTransfer, TokenTransferDocument, TransactionStatus } from './entities/token-transfer.entity';
export declare class TokensService {
    private tokenTransferModel;
    constructor(tokenTransferModel: Model<TokenTransferDocument>);
    create(senderId: string, createTokenTransferDto: CreateTokenTransferDto): Promise<TokenTransfer>;
    findAll(userId: string): Promise<TokenTransfer[]>;
    findOne(id: string, userId: string): Promise<TokenTransfer>;
    updateStatus(id: string, status: TransactionStatus): Promise<TokenTransfer>;
    private initiateStarkNetTransfer;
    checkTransactionStatus(txHash: string): Promise<TransactionStatus>;
    validateTokenBalance(userId: string, tokenAddress: string, amount: string): Promise<boolean>;
}
