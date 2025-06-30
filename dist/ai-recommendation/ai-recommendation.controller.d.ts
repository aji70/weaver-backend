import { AiRecommendationService } from './ai-recommendation.service';
import { AlertType, AlertSeverity } from './entities/alert.entity';
export declare class AiRecommendationController {
    private readonly aiRecommendationService;
    constructor(aiRecommendationService: AiRecommendationService);
    getCampaignRecommendations(campaignId: string): Promise<import("./entities/recommendation.entity").Recommendation[]>;
    getAlerts(type?: AlertType, severity?: AlertSeverity, resolved?: boolean): Promise<import("./entities/alert.entity").Alert[]>;
    markRecommendationAsRead(id: string): Promise<import("./entities/recommendation.entity").Recommendation>;
    markRecommendationAsApplied(id: string): Promise<import("./entities/recommendation.entity").Recommendation>;
    resolveAlert(id: string): Promise<import("./entities/alert.entity").Alert>;
    triggerUserAnalysis(userId: string): Promise<{
        message: string;
    }>;
    triggerCampaignAnalysis(campaignId: string): Promise<{
        message: string;
    }>;
}
