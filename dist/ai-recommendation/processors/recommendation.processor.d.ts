import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Recommendation } from '../entities/recommendation.entity';
import { Alert } from '../entities/alert.entity';
import { AnalyticsService } from '../../x-analytics/analytics.service';
export declare class RecommendationProcessor {
    private recommendationRepository;
    private alertRepository;
    private analyticsService;
    constructor(recommendationRepository: Repository<Recommendation>, alertRepository: Repository<Alert>, analyticsService: AnalyticsService);
    handleCampaignAnalysis(job: Job<{
        campaignId: string;
    }>): Promise<void>;
    handleUserAnalysis(job: Job<{
        userId: string;
    }>): Promise<void>;
    private analyzeCampaignPerformance;
    private analyzeUserBehavior;
    private detectCampaignAnomalies;
    private detectUserAnomalies;
}
