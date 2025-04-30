import { Module } from '@nestjs/common';
import { DiscordAnalyticsController } from './discord-analytics.controller';
import { DiscordAnalyticsService } from './discord-analytics.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [DiscordAnalyticsController],
  providers: [DiscordAnalyticsService],
  exports: [DiscordAnalyticsService],
})
export class DiscordAnalyticsModule {}
