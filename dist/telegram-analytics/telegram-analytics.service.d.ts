import { ConfigService } from '@nestjs/config';
import { TelegramAnalytics } from './interfaces/telegram-analytics.interface';
export declare class TelegramAnalyticsService {
    private configService;
    private client;
    private stringSession;
    constructor(configService: ConfigService);
    initialize(): Promise<void>;
    getMessageAnalytics(chatId: string, days?: number): Promise<TelegramAnalytics>;
    private categorizeMessagesByType;
    private analyzeMessageTiming;
    private analyzeUserActivity;
    private analyzeMediaContent;
    private analyzeMessageLanguages;
    private analyzeMessageSentiment;
    private analyzeUserStats;
    private analyzeEngagement;
    private analyzeContent;
    private analyzeNetwork;
}
