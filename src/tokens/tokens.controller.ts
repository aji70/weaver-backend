import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenTransferDto } from './dto/create-token-transfer.dto';
import {
  TokenTransfer,
  TransactionStatus,
} from './entities/token-transfer.entity';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('transfer')
  async create(
    @Query('userId') userId: string,
    @Body() createTokenTransferDto: CreateTokenTransferDto,
  ): Promise<TokenTransfer> {
    // TODO: Add authentication guard
    return this.tokensService.create(userId, createTokenTransferDto);
  }

  @Get('transfers')
  findAll(@Query('userId') userId: string): Promise<TokenTransfer[]> {
    // TODO: Add authentication guard
    return this.tokensService.findAll(userId);
  }

  @Get('transfers/:id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<TokenTransfer> {
    return this.tokensService.findOne(id, userId);
  }

  @Get('transfers/:id/status')
  async checkStatus(
    @Param('id') id: string,
  ): Promise<{ status: TransactionStatus }> {
    const transfer = await this.tokensService.findOne(id, null);
    const status = await this.tokensService.checkTransactionStatus(
      transfer.starknetTxHash,
    );
    await this.tokensService.updateStatus(id, status);
    return { status };
  }

  @Get('validate-balance')
  async validateBalance(
    @Query('userId') userId: string,
    @Query('tokenAddress') tokenAddress: string,
    @Query('amount') amount: string,
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.tokensService.validateTokenBalance(
      userId,
      tokenAddress,
      amount,
    );
    return { isValid };
  }
}
