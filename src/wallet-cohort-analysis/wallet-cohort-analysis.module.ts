import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cohort, CohortSchema } from './entities/cohort.entity';
import { WalletCohortAnalysisService } from './wallet-cohort-analysis.service';
import { WalletCohortAnalysisController } from './wallet-cohort-analysis.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohort.name, schema: CohortSchema }]),
  ],
  providers: [WalletCohortAnalysisService],
  controllers: [WalletCohortAnalysisController],
  exports: [WalletCohortAnalysisService],
})
export class WalletCohortAnalysisModule {}
