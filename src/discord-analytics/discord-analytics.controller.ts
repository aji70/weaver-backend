import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { DiscordAnalyticsService } from './discord-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('discord-analytics')
@UseGuards(JwtAuthGuard)
export class DiscordAnalyticsController {
  constructor(
    private readonly discordAnalyticsService: DiscordAnalyticsService,
  ) {}

  @Get('server/:serverId')
  async getServerAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getServerAnalytics(serverId);
  }

  @Get('channels/:serverId')
  async getChannelAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getChannelAnalytics(serverId);
  }

  @Get('members/:serverId')
  async getMemberAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getMemberAnalytics(serverId);
  }

  @Get('messages/:serverId')
  async getMessageAnalytics(
    @Param('serverId') serverId: string,
    @Query('days') days: number = 30,
  ) {
    return this.discordAnalyticsService.getMessageAnalytics(serverId, days);
  }

  @Get('activity/:serverId')
  async getActivityAnalytics(
    @Param('serverId') serverId: string,
    @Query('days') days: number = 30,
  ) {
    return this.discordAnalyticsService.getActivityAnalytics(serverId, days);
  }

  @Get('roles/:serverId')
  async getRoleAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getRoleAnalytics(serverId);
  }

  @Get('emojis/:serverId')
  async getEmojiAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getEmojiAnalytics(serverId);
  }

  @Get('voice/:serverId')
  async getVoiceAnalytics(
    @Param('serverId') serverId: string,
    @Query('days') days: number = 30,
  ) {
    return this.discordAnalyticsService.getVoiceAnalytics(serverId, days);
  }

  @Get('reactions/:serverId')
  async getReactionAnalytics(
    @Param('serverId') serverId: string,
    @Query('days') days: number = 30,
  ) {
    return this.discordAnalyticsService.getReactionAnalytics(serverId, days);
  }

  @Get('bots/:serverId')
  async getBotAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getBotAnalytics(serverId);
  }

  @Get('invites/:serverId')
  async getInviteAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getInviteAnalytics(serverId);
  }

  @Get('moderation/:serverId')
  async getModerationAnalytics(@Param('serverId') serverId: string) {
    return this.discordAnalyticsService.getModerationAnalytics(serverId);
  }
}
