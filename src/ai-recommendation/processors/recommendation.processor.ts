import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation, RecommendationType } from '../entities/recommendation.entity';
import { Alert, AlertType } from '../entities/alert.entity';
import { AnalyticsService } from '../../x-analytics/analytics.service';

@Injectable()
@Processor('recommendations')
export class RecommendationProcessor {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private analyticsService: AnalyticsService,
  ) {}

  @Process('analyze-campaign')
  async handleCampaignAnalysis(job: Job<{ campaignId: string }>) {
    const { campaignId } = job.data;
    const campaignMetrics = await this.analyticsService.getCampaignMetrics(campaignId);

    // Analyze campaign performance
    const recommendations = await this.analyzeCampaignPerformance(campaignId, campaignMetrics);
    await this.recommendationRepository.save(recommendations);

    // Check for anomalies
    const alerts = await this.detectCampaignAnomalies(campaignId, campaignMetrics);
    if (alerts.length > 0) {
      await this.alertRepository.save(alerts);
    }
  }

  @Process('analyze-user')
  async handleUserAnalysis(job: Job<{ userId: string }>) {
    const { userId } = job.data;
    const userMetrics = await this.analyticsService.getUserMetrics(userId);

    // Analyze user behavior
    const recommendations = await this.analyzeUserBehavior(userId, userMetrics);
    await this.recommendationRepository.save(recommendations);

    // Check for suspicious activity
    const alerts = await this.detectUserAnomalies(userId, userMetrics);
    if (alerts.length > 0) {
      await this.alertRepository.save(alerts);
    }
  }

  private async analyzeCampaignPerformance(
    campaignId: string,
    metrics: Record<string, any>,
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Example rule-based analysis
    if (metrics.engagementRate < 0.1) {
      recommendations.push({
        type: RecommendationType.CAMPAIGN_OPTIMIZATION,
        targetId: campaignId,
        description: 'Low engagement rate detected. Consider adjusting campaign timing or rewards.',
        data: {
          currentEngagementRate: metrics.engagementRate,
          suggestedActions: ['Adjust timing', 'Increase rewards', 'Target different audience'],
        },
        metrics: {
          engagementRate: metrics.engagementRate,
          threshold: 0.1,
        },
      } as Recommendation);
    }

    return recommendations;
  }

  private async analyzeUserBehavior(
    userId: string,
    metrics: Record<string, any>,
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Example churn prediction
    if (metrics.activityDrop > 0.5) {
      recommendations.push({
        type: RecommendationType.USER_RETENTION,
        targetId: userId,
        description: 'User showing signs of disengagement. Consider retention strategies.',
        data: {
          activityDrop: metrics.activityDrop,
          suggestedActions: ['Send personalized message', 'Offer incentives', 'Check for issues'],
        },
        metrics: {
          activityDrop: metrics.activityDrop,
          threshold: 0.5,
        },
      } as Recommendation);
    }

    return recommendations;
  }

  private async detectCampaignAnomalies(
    campaignId: string,
    metrics: Record<string, any>,
  ): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Example anomaly detection
    if (metrics.suspiciousActivity > 0.8) {
      alerts.push({
        type: AlertType.FARMING_DETECTED,
        severity: AlertSeverity.CRITICAL,
        targetId: campaignId,
        description: 'High level of suspicious activity detected in campaign.',
        data: {
          suspiciousActivity: metrics.suspiciousActivity,
          affectedUsers: metrics.suspiciousUsers,
        },
        metrics: {
          suspiciousActivity: metrics.suspiciousActivity,
          threshold: 0.8,
        },
      } as Alert);
    }

    return alerts;
  }

  private async detectUserAnomalies(
    userId: string,
    metrics: Record<string, any>,
  ): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Example bot detection
    if (metrics.botProbability > 0.9) {
      alerts.push({
        type: AlertType.BOT_ACTIVITY,
        severity: AlertSeverity.CRITICAL,
        targetId: userId,
        description: 'Bot-like behavior detected.',
        data: {
          botProbability: metrics.botProbability,
          suspiciousPatterns: metrics.suspiciousPatterns,
        },
        metrics: {
          botProbability: metrics.botProbability,
          threshold: 0.9,
        },
      } as Alert);
    }

    return alerts;
  }
} 