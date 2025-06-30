"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twitter_api_v2_1 = require("twitter-api-v2");
let TwitterAnalyticsService = class TwitterAnalyticsService {
    configService;
    twitterClient;
    constructor(configService) {
        this.configService = configService;
        this.twitterClient = new twitter_api_v2_1.TwitterApi({
            appKey: this.configService.get('TWITTER_API_KEY'),
            appSecret: this.configService.get('TWITTER_API_SECRET'),
            accessToken: this.configService.get('TWITTER_ACCESS_TOKEN'),
            accessSecret: this.configService.get('TWITTER_ACCESS_TOKEN_SECRET'),
        });
    }
    async getUserStats(username) {
        try {
            const user = await this.twitterClient.v2.userByUsername(username, {
                'user.fields': ['public_metrics', 'description', 'created_at', 'profile_image_url'],
            });
            return user.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch user stats: ${error.message}`);
        }
    }
    async getTweetStats(tweetId) {
        try {
            const tweet = await this.twitterClient.v2.singleTweet(tweetId, {
                'tweet.fields': ['public_metrics', 'created_at', 'text'],
                'user.fields': ['username', 'name'],
            });
            return tweet.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch tweet stats: ${error.message}`);
        }
    }
    async getEngagementMetrics(username) {
        try {
            const user = await this.twitterClient.v2.userByUsername(username);
            const tweets = await this.twitterClient.v2.userTimeline(user.data.id, {
                'tweet.fields': ['public_metrics', 'created_at'],
                max_results: 100,
            });
            const metrics = {
                totalTweets: 0,
                totalLikes: 0,
                totalRetweets: 0,
                totalReplies: 0,
                averageEngagement: 0,
            };
            for await (const tweet of tweets) {
                metrics.totalTweets++;
                metrics.totalLikes += tweet.public_metrics?.like_count || 0;
                metrics.totalRetweets += tweet.public_metrics?.retweet_count || 0;
                metrics.totalReplies += tweet.public_metrics?.reply_count || 0;
            }
            metrics.averageEngagement =
                (metrics.totalLikes + metrics.totalRetweets + metrics.totalReplies) / metrics.totalTweets;
            return metrics;
        }
        catch (error) {
            throw new Error(`Failed to fetch engagement metrics: ${error.message}`);
        }
    }
};
exports.TwitterAnalyticsService = TwitterAnalyticsService;
exports.TwitterAnalyticsService = TwitterAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TwitterAnalyticsService);
//# sourceMappingURL=x-analytics.service.js.map