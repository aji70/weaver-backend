import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardDistributionController } from './reward-distribution.controller';
import { RewardDistributionService } from './reward-distribution.service';
import { Reward } from './entities/reward.entity';
import { RewardClaim } from './entities/reward-claim.entity';
import { BullModule } from '@nestjs/bull';
import { RewardProcessor } from './processors/reward.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, RewardClaim]),
    BullModule.registerQueue({
      name: 'rewards',
    }),
    ConfigModule,
  ],
  controllers: [RewardDistributionController],
  providers: [RewardDistributionService, RewardProcessor],
  exports: [RewardDistributionService],
})
export class RewardDistributionModule {} 