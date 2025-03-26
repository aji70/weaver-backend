import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import {
  TokenTransfer,
  TokenTransferSchema,
} from './entities/token-transfer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenTransfer.name, schema: TokenTransferSchema },
    ]),
  ],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
