import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterAnalyticsService {
  private twitterClient: TwitterApi;

  constructor(private configService: ConfigService) {
    this.twitterClient = new TwitterApi({
      appKey: this.configService.get<string>('TWITTER_API_KEY'),
      appSecret: this.configService.get<string>('TWITTER_API_SECRET'),
      accessToken: this.configService.get<string>('TWITTER_ACCESS_TOKEN'),
      accessSecret: this.configService.get<string>('TWITTER_ACCESS_TOKEN_SECRET'),
    });
  }

  async getUserStats(username: string) {
    try {
      const user = await this.twitterClient.v2.userByUsername(username, {
        'user.fields': ['public_metrics', 'description', 'created_at', 'profile_image_url'],
      });
      return user.data;
    } catch (error) {
      throw new Error(`Failed to fetch user stats: ${error.message}`);
    }
  }

  async getTweetStats(tweetId: string) {
    try {
      const tweet = await this.twitterClient.v2.singleTweet(tweetId, {
        'tweet.fields': ['public_metrics', 'created_at', 'text'],
        'user.fields': ['username', 'name'],
      });
      return tweet.data;
    } catch (error) {
      throw new Error(`Failed to fetch tweet stats: ${error.message}`);
    }
  }

  async getEngagementMetrics(username: string) {
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
    } catch (error) {
      throw new Error(`Failed to fetch engagement metrics: ${error.message}`);
    }
  }
} 