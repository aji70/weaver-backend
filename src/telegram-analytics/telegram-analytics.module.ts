import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramAnalyticsController } from './telegram-analytics.controller';
import { TelegramAnalyticsService } from './telegram-analytics.service';

@Module({
  imports: [ConfigModule],
  controllers: [TelegramAnalyticsController],
  providers: [TelegramAnalyticsService],
  exports: [TelegramAnalyticsService],
})
export class TelegramAnalyticsModule {}
