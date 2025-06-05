import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReputationEngineService } from './reputation-engine.service';
import { ReputationEngineController } from './reputation-engine.controller';
import { ReputationScore } from './entities/reputation-score.entity';
import { ReputationFactor } from './entities/reputation-factor.entity';
import { ReputationCalculator } from './services/reputation-calculator.service';
import { ReputationFactorService } from './services/reputation-factor.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ReputationScore, ReputationFactor]),
  ],
  controllers: [ReputationEngineController],
  providers: [
    ReputationEngineService,
    ReputationCalculator,
    ReputationFactorService,
  ],
  exports: [ReputationEngineService],
})
export class ReputationEngineModule {} 