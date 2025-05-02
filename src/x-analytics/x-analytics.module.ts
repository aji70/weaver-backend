import { Module } from '@nestjs/common';
import { TwitterAnalyticsController } from './x-analytics.controller';
import { TwitterAnalyticsService } from './x-analytics.service';

@Module({
  controllers: [TwitterAnalyticsController],
  providers: [TwitterAnalyticsService],
  exports: [TwitterAnalyticsService],
})
export class TwitterAnalyticsModule {} 