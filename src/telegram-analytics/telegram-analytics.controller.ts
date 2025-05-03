import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TelegramAnalyticsService } from './telegram-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Telegram Analytics')
@Controller('telegram-analytics')
@UseGuards(JwtAuthGuard)
export class TelegramAnalyticsController {
  constructor(
    private readonly telegramAnalyticsService: TelegramAnalyticsService,
  ) {}

  @Get('chat/:chatId')
  @ApiOperation({ summary: 'Get comprehensive analytics for a Telegram chat' })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    type: Number,
  })
  async getChatAnalytics(
    @Param('chatId') chatId: string,
    @Query('days') days: number = 30,
  ) {
    return this.telegramAnalyticsService.getMessageAnalytics(chatId, days);
  }

  @Get('chat/:chatId/messages')
  @ApiOperation({
    summary: 'Get message-specific analytics for a Telegram chat',
  })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    type: Number,
  })
  async getMessageAnalytics(
    @Param('chatId') chatId: string,
    @Query('days') days: number = 30,
  ) {
    const analytics = await this.telegramAnalyticsService.getMessageAnalytics(
      chatId,
      days,
    );
    return analytics.messageStats;
  }

  @Get('chat/:chatId/users')
  @ApiOperation({ summary: 'Get user-specific analytics for a Telegram chat' })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  async getUserAnalytics(@Param('chatId') chatId: string) {
    const analytics =
      await this.telegramAnalyticsService.getMessageAnalytics(chatId);
    return analytics.userStats;
  }

  @Get('chat/:chatId/engagement')
  @ApiOperation({ summary: 'Get engagement metrics for a Telegram chat' })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    type: Number,
  })
  async getEngagementAnalytics(
    @Param('chatId') chatId: string,
    @Query('days') days: number = 30,
  ) {
    const analytics = await this.telegramAnalyticsService.getMessageAnalytics(
      chatId,
      days,
    );
    return analytics.engagementStats;
  }

  @Get('chat/:chatId/content')
  @ApiOperation({ summary: 'Get content analysis for a Telegram chat' })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    type: Number,
  })
  async getContentAnalytics(
    @Param('chatId') chatId: string,
    @Query('days') days: number = 30,
  ) {
    const analytics = await this.telegramAnalyticsService.getMessageAnalytics(
      chatId,
      days,
    );
    return analytics.contentStats;
  }

  @Get('chat/:chatId/network')
  @ApiOperation({ summary: 'Get network analysis for a Telegram chat' })
  @ApiParam({ name: 'chatId', description: 'Telegram chat ID' })
  async getNetworkAnalytics(@Param('chatId') chatId: string) {
    const analytics =
      await this.telegramAnalyticsService.getMessageAnalytics(chatId);
    return analytics.networkStats;
  }
}
