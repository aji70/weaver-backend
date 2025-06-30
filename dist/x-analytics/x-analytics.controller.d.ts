import { TwitterAnalyticsService } from './x-analytics.service';
export declare class TwitterAnalyticsController {
    private readonly twitterAnalyticsService;
    constructor(twitterAnalyticsService: TwitterAnalyticsService);
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
