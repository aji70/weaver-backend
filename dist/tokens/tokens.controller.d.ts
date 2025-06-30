import { TokensService } from './tokens.service';
import { CreateTokenTransferDto } from './dto/create-token-transfer.dto';
import { TokenTransfer, TransactionStatus } from './entities/token-transfer.entity';
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
    create(userId: string, createTokenTransferDto: CreateTokenTransferDto): Promise<TokenTransfer>;
    findAll(userId: string): Promise<TokenTransfer[]>;
    findOne(id: string, userId: string): Promise<TokenTransfer>;
    checkStatus(id: string): Promise<{
        status: TransactionStatus;
    }>;
    validateBalance(userId: string, tokenAddress: string, amount: string): Promise<{
        isValid: boolean;
    }>;
}
