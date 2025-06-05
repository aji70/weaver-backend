import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignAnalyticsController } from './campaign-analytics.controller';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { CampaignMetric, CampaignMetricSchema } from './schemas/campaign-metric.schema';
import { CampaignSummary, CampaignSummarySchema } from './schemas/campaign-summary.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: CampaignMetric.name, schema: CampaignMetricSchema },
      { name: CampaignSummary.name, schema: CampaignSummarySchema },
    ]),
  ],
  controllers: [CampaignAnalyticsController],
  providers: [CampaignAnalyticsService],
  exports: [CampaignAnalyticsService],
})
export class CampaignAnalyticsModule {} 