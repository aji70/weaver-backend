import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Recommendation, RecommendationType } from './entities/recommendation.entity';
import { Alert, AlertType, AlertSeverity } from './entities/alert.entity';

@Injectable()
export class AiRecommendationService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectQueue('recommendations')
    private recommendationsQueue: Queue,
  ) {}

  async getCampaignRecommendations(campaignId: string): Promise<Recommendation[]> {
    const recommendations = await this.recommendationRepository.find({
      where: {
        targetId: campaignId,
        type: RecommendationType.CAMPAIGN_OPTIMIZATION,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!recommendations.length) {
      // Trigger background analysis if no recommendations exist
      await this.recommendationsQueue.add('analyze-campaign', { campaignId });
    }

    return recommendations;
  }

  async getAlerts(
    type?: AlertType,
    severity?: AlertSeverity,
    resolved?: boolean,
  ): Promise<Alert[]> {
    const query = this.alertRepository.createQueryBuilder('alert');

    if (type) {
      query.andWhere('alert.type = :type', { type });
    }

    if (severity) {
      query.andWhere('alert.severity = :severity', { severity });
    }

    if (typeof resolved === 'boolean') {
      query.andWhere('alert.isResolved = :resolved', { resolved });
    }

    return query.orderBy('alert.createdAt', 'DESC').getMany();
  }

  async markRecommendationAsRead(id: string): Promise<Recommendation> {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    recommendation.isRead = true;
    return this.recommendationRepository.save(recommendation);
  }

  async markRecommendationAsApplied(id: string): Promise<Recommendation> {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    recommendation.isApplied = true;
    return this.recommendationRepository.save(recommendation);
  }

  async resolveAlert(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    return this.alertRepository.save(alert);
  }

  async triggerUserAnalysis(userId: string): Promise<void> {
    await this.recommendationsQueue.add('analyze-user', { userId });
  }

  async triggerCampaignAnalysis(campaignId: string): Promise<void> {
    await this.recommendationsQueue.add('analyze-campaign', { campaignId });
  }
} 