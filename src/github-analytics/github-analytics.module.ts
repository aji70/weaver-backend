import { Module } from '@nestjs/common';
import { GithubAnalyticsController } from './github-analytics.controller';
import { GithubAnalyticsService } from './github-analytics.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [GithubAnalyticsController],
  providers: [GithubAnalyticsService],
  exports: [GithubAnalyticsService],
})
export class GithubAnalyticsModule {}
