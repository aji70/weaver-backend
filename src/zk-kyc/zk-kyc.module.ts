import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ZkKycController } from './zk-kyc.controller';
import { ZkKycService } from './zk-kyc.service';
import { WorldIdService } from './services/world-id.service';
import {
  ZkKycVerification,
  ZkKycVerificationSchema,
} from './entities/zk-kyc-verification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ZkKycVerification.name, schema: ZkKycVerificationSchema },
    ]),
  ],
  controllers: [ZkKycController],
  providers: [ZkKycService, WorldIdService],
  exports: [ZkKycService, WorldIdService],
})
export class ZkKycModule {}
