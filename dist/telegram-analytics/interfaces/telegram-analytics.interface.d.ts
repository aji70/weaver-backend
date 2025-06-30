export interface TelegramAnalytics {
    messageStats: {
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
    };
    userStats: {
        total: number;
        active: number;
        byRole: Record<string, number>;
        joinDates: Record<string, number>;
        activityLevels: Record<string, string>;
    };
    engagementStats: {
        reactions: Record<string, number>;
        forwards: number;
        replies: number;
        averageResponseTime: number;
        peakActivityTimes: string[];
    };
    contentStats: {
        topWords: Record<string, number>;
        topHashtags: Record<string, number>;
        topMentions: Record<string, number>;
        topLinks: Record<string, number>;
        averageMessageLength: number;
    };
    networkStats: {
        userConnections: Record<string, string[]>;
        influenceScore: Record<string, number>;
        communityClusters: string[][];
        informationFlow: Record<string, Record<string, number>>;
    };
}
