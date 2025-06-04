import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { CreateCampaignMetricDto, CampaignMetricResponseDto } from './dto/campaign-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics/campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignAnalyticsController {
  constructor(private readonly campaignAnalyticsService: CampaignAnalyticsService) {}

  @Post(':campaignId/metrics')
  async trackMetric(
    @Param('campaignId') campaignId: string,
    @Body() createMetricDto: CreateCampaignMetricDto,
  ): Promise<CampaignMetricResponseDto> {
    createMetricDto.campaignId = campaignId;
    return this.campaignAnalyticsService.trackMetric(createMetricDto);
  }

  @Get(':campaignId')
  async getCampaignMetrics(
    @Param('campaignId') campaignId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.campaignAnalyticsService.getCampaignMetrics(
      campaignId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':campaignId/summary')
  async getCampaignSummary(
    @Param('campaignId') campaignId: string,
    @Query('date') date?: string,
  ) {
    return this.campaignAnalyticsService.getCampaignSummary(
      campaignId,
      date ? new Date(date) : undefined,
    );
  }
} 