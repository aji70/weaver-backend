import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TwitterAnalyticsService } from './x-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('twitter-analytics')
@UseGuards(JwtAuthGuard)
export class TwitterAnalyticsController {
  constructor(private readonly twitterAnalyticsService: TwitterAnalyticsService) {}

  @Get('user-stats')
  async getUserStats(@Query('username') username: string) {
    return this.twitterAnalyticsService.getUserStats(username);
  }

  @Get('tweet-stats')
  async getTweetStats(@Query('tweetId') tweetId: string) {
    return this.twitterAnalyticsService.getTweetStats(tweetId);
  }

  @Get('engagement-metrics')
  async getEngagementMetrics(@Query('username') username: string) {
    return this.twitterAnalyticsService.getEngagementMetrics(username);
  }
} 