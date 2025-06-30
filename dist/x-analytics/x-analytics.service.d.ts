import { ConfigService } from '@nestjs/config';
export declare class TwitterAnalyticsService {
    private configService;
    private twitterClient;
    constructor(configService: ConfigService);
    getUserStats(username: string): Promise<any>;
    getTweetStats(tweetId: string): Promise<any>;
    getEngagementMetrics(username: string): Promise<{
        totalTweets: number;
        totalLikes: number;
        totalRetweets: number;
        totalReplies: number;
        averageEngagement: number;
    }>;
}
