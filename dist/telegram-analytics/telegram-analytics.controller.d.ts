import { TelegramAnalyticsService } from './telegram-analytics.service';
export declare class TelegramAnalyticsController {
    private readonly telegramAnalyticsService;
    constructor(telegramAnalyticsService: TelegramAnalyticsService);
    getChatAnalytics(chatId: string, days?: number): Promise<import("./interfaces/telegram-analytics.interface").TelegramAnalytics>;
    getMessageAnalytics(chatId: string, days?: number): Promise<{
        total: number;
        byType: Record<string, number>;
        byHour: Record<number, number>;
        byUser: Record<string, number>;
        mediaStats: {
            total: number;
            byType: Record<string, number>;
            averageSize: number;
            topSenders: Record<string, number>;
        };
        languageStats: Record<string, number>;
        sentimentAnalysis: {
            positive: number;
            negative: number;
            neutral: number;
            average: number;
        };
    }>;
    getUserAnalytics(chatId: string): Promise<{
        total: number;
        active: number;
        byRole: Record<string, number>;
        joinDates: Record<string, number>;
        activityLevels: Record<string, string>;
    }>;
    getEngagementAnalytics(chatId: string, days?: number): Promise<{
        reactions: Record<string, number>;
        forwards: number;
        replies: number;
        averageResponseTime: number;
        peakActivityTimes: string[];
    }>;
    getContentAnalytics(chatId: string, days?: number): Promise<{
        topWords: Record<string, number>;
        topHashtags: Record<string, number>;
        topMentions: Record<string, number>;
        topLinks: Record<string, number>;
        averageMessageLength: number;
    }>;
    getNetworkAnalytics(chatId: string): Promise<{
        userConnections: Record<string, string[]>;
        influenceScore: Record<string, number>;
        communityClusters: string[][];
        informationFlow: Record<string, Record<string, number>>;
    }>;
}
