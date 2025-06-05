import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AiRecommendationService } from './ai-recommendation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AlertType, AlertSeverity } from './entities/alert.entity';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiRecommendationController {
  constructor(private readonly aiRecommendationService: AiRecommendationService) {}

  @Get('recommendations/:campaignId')
  @Roles('admin', 'moderator')
  async getCampaignRecommendations(@Param('campaignId') campaignId: string) {
    return this.aiRecommendationService.getCampaignRecommendations(campaignId);
  }

  @Get('alerts')
  @Roles('admin', 'moderator')
  async getAlerts(
    @Query('type') type?: AlertType,
    @Query('severity') severity?: AlertSeverity,
    @Query('resolved') resolved?: boolean,
  ) {
    return this.aiRecommendationService.getAlerts(type, severity, resolved);
  }

  @Post('recommendations/:id/read')
  @Roles('admin', 'moderator')
  async markRecommendationAsRead(@Param('id') id: string) {
    return this.aiRecommendationService.markRecommendationAsRead(id);
  }

  @Post('recommendations/:id/apply')
  @Roles('admin', 'moderator')
  async markRecommendationAsApplied(@Param('id') id: string) {
    return this.aiRecommendationService.markRecommendationAsApplied(id);
  }

  @Post('alerts/:id/resolve')
  @Roles('admin', 'moderator')
  async resolveAlert(@Param('id') id: string) {
    return this.aiRecommendationService.resolveAlert(id);
  }

  @Post('analyze/user/:userId')
  @Roles('admin', 'moderator')
  async triggerUserAnalysis(@Param('userId') userId: string) {
    await this.aiRecommendationService.triggerUserAnalysis(userId);
    return { message: 'User analysis triggered successfully' };
  }

  @Post('analyze/campaign/:campaignId')
  @Roles('admin', 'moderator')
  async triggerCampaignAnalysis(@Param('campaignId') campaignId: string) {
    await this.aiRecommendationService.triggerCampaignAnalysis(campaignId);
    return { message: 'Campaign analysis triggered successfully' };
  }
} 