import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Recommendation } from './entities/recommendation.entity';
import { Alert, AlertType, AlertSeverity } from './entities/alert.entity';
export declare class AiRecommendationService {
    private recommendationRepository;
    private alertRepository;
    private recommendationsQueue;
    constructor(recommendationRepository: Repository<Recommendation>, alertRepository: Repository<Alert>, recommendationsQueue: Queue);
    getCampaignRecommendations(campaignId: string): Promise<Recommendation[]>;
    getAlerts(type?: AlertType, severity?: AlertSeverity, resolved?: boolean): Promise<Alert[]>;
    markRecommendationAsRead(id: string): Promise<Recommendation>;
    markRecommendationAsApplied(id: string): Promise<Recommendation>;
    resolveAlert(id: string): Promise<Alert>;
    triggerUserAnalysis(userId: string): Promise<void>;
    triggerCampaignAnalysis(campaignId: string): Promise<void>;
}
