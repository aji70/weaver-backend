import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { TelegramAnalytics } from './interfaces/telegram-analytics.interface';
import { Message, User, Chat, ChatMember } from 'telegram/tl/custom';

@Injectable()
export class TelegramAnalyticsService {
  private client: TelegramClient;
  private stringSession: StringSession;

  constructor(private configService: ConfigService) {
    this.stringSession = new StringSession('');
    this.client = new TelegramClient(
      this.stringSession,
      this.configService.get<string>('TELEGRAM_API_ID'),
      this.configService.get<string>('TELEGRAM_API_HASH'),
      { connectionRetries: 5 },
    );
  }

  async initialize() {
    await this.client.connect();
    await this.client.signIn({
      phoneNumber: this.configService.get<string>('TELEGRAM_PHONE'),
      password: async () => this.configService.get<string>('TELEGRAM_PASSWORD'),
      phoneCode: async () => this.configService.get<string>('TELEGRAM_CODE'),
      onError: (err) => console.log(err),
    });
  }

  async getMessageAnalytics(
    chatId: string,
    days: number = 30,
  ): Promise<TelegramAnalytics> {
    const messages = await this.client.getMessages(chatId, {
      limit: 1000,
      offsetDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    });

    const analytics: TelegramAnalytics = {
      messageStats: {
        total: messages.length,
        byType: this.categorizeMessagesByType(messages),
        byHour: this.analyzeMessageTiming(messages),
        byUser: this.analyzeUserActivity(messages),
        mediaStats: this.analyzeMediaContent(messages),
        languageStats: this.analyzeMessageLanguages(messages),
        sentimentAnalysis: this.analyzeMessageSentiment(messages),
      },
      userStats: await this.analyzeUserStats(chatId),
      engagementStats: this.analyzeEngagement(messages),
      contentStats: this.analyzeContent(messages),
      networkStats: await this.analyzeNetwork(chatId),
    };

    return analytics;
  }

  private categorizeMessagesByType(
    messages: Message[],
  ): Record<string, number> {
    const types: Record<string, number> = {
      text: 0,
      photo: 0,
      video: 0,
      document: 0,
      sticker: 0,
      voice: 0,
      location: 0,
      poll: 0,
      other: 0,
    };

    messages.forEach((msg) => {
      if (msg.media) {
        if (msg.media.className === 'MessageMediaPhoto') types.photo++;
        else if (msg.media.className === 'MessageMediaDocument') {
          const doc = msg.media.document;
          if (doc.mimeType.startsWith('video/')) types.video++;
          else types.document++;
        }
      } else if (msg.message) types.text++;
      else if (msg.sticker) types.sticker++;
      else if (msg.voice) types.voice++;
      else if (msg.geo) types.location++;
      else if (msg.poll) types.poll++;
      else types.other++;
    });

    return types;
  }

  private analyzeMessageTiming(messages: Message[]): Record<number, number> {
    const hourlyDistribution: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourlyDistribution[i] = 0;

    messages.forEach((msg) => {
      const hour = new Date(msg.date * 1000).getHours();
      hourlyDistribution[hour]++;
    });

    return hourlyDistribution;
  }

  private analyzeUserActivity(messages: Message[]): Record<string, number> {
    const userActivity: Record<string, number> = {};
    messages.forEach((msg) => {
      const userId = msg.fromId?.toString() || 'unknown';
      userActivity[userId] = (userActivity[userId] || 0) + 1;
    });
    return userActivity;
  }

  private analyzeMediaContent(messages: Message[]): {
    total: number;
    byType: Record<string, number>;
    averageSize: number;
    topSenders: Record<string, number>;
  } {
    const mediaStats = {
      total: 0,
      byType: {} as Record<string, number>,
      averageSize: 0,
      topSenders: {} as Record<string, number>,
      totalSize: 0,
    };

    messages.forEach((msg) => {
      if (msg.media) {
        mediaStats.total++;
        const type = msg.media.className;
        mediaStats.byType[type] = (mediaStats.byType[type] || 0) + 1;

        if (msg.media.document) {
          mediaStats.totalSize += msg.media.document.size;
        }

        const userId = msg.fromId?.toString() || 'unknown';
        mediaStats.topSenders[userId] =
          (mediaStats.topSenders[userId] || 0) + 1;
      }
    });

    mediaStats.averageSize =
      mediaStats.total > 0 ? mediaStats.totalSize / mediaStats.total : 0;
    return mediaStats;
  }

  private analyzeMessageLanguages(messages: Message[]): Record<string, number> {
    const languageStats: Record<string, number> = {};
    // Implement language detection logic here
    return languageStats;
  }

  private analyzeMessageSentiment(messages: Message[]): {
    positive: number;
    negative: number;
    neutral: number;
    average: number;
  } {
    // Implement sentiment analysis logic here
    return {
      positive: 0,
      negative: 0,
      neutral: 0,
      average: 0,
    };
  }

  private async analyzeUserStats(chatId: string): Promise<{
    total: number;
    active: number;
    byRole: Record<string, number>;
    joinDates: Record<string, number>;
    activityLevels: Record<string, string>;
  }> {
    const participants = await this.client.getParticipants(chatId);
    const stats = {
      total: participants.length,
      active: 0,
      byRole: {} as Record<string, number>,
      joinDates: {} as Record<string, number>,
      activityLevels: {} as Record<string, string>,
    };

    participants.forEach((participant) => {
      if (participant.status) {
        stats.byRole[participant.status.className] =
          (stats.byRole[participant.status.className] || 0) + 1;
      }
    });

    return stats;
  }

  private analyzeEngagement(messages: Message[]): {
    reactions: Record<string, number>;
    forwards: number;
    replies: number;
    averageResponseTime: number;
    peakActivityTimes: string[];
  } {
    const engagement = {
      reactions: {} as Record<string, number>,
      forwards: 0,
      replies: 0,
      averageResponseTime: 0,
      peakActivityTimes: [] as string[],
    };

    messages.forEach((msg) => {
      if (msg.replies) engagement.replies++;
      if (msg.forwards) engagement.forwards += msg.forwards;
      if (msg.reactions) {
        msg.reactions.results.forEach((reaction) => {
          const emoji = reaction.reaction;
          engagement.reactions[emoji] =
            (engagement.reactions[emoji] || 0) + reaction.count;
        });
      }
    });

    return engagement;
  }

  private analyzeContent(messages: Message[]): {
    topWords: Record<string, number>;
    topHashtags: Record<string, number>;
    topMentions: Record<string, number>;
    topLinks: Record<string, number>;
    averageMessageLength: number;
  } {
    const content = {
      topWords: {} as Record<string, number>,
      topHashtags: {} as Record<string, number>,
      topMentions: {} as Record<string, number>,
      topLinks: {} as Record<string, number>,
      averageMessageLength: 0,
      totalLength: 0,
      messageCount: 0,
    };

    messages.forEach((msg) => {
      if (msg.message) {
        const words = msg.message.split(/\s+/);
        content.messageCount++;
        content.totalLength += msg.message.length;

        words.forEach((word) => {
          if (word.startsWith('#')) {
            content.topHashtags[word] = (content.topHashtags[word] || 0) + 1;
          } else if (word.startsWith('@')) {
            content.topMentions[word] = (content.topMentions[word] || 0) + 1;
          } else if (word.match(/https?:\/\/.+/)) {
            content.topLinks[word] = (content.topLinks[word] || 0) + 1;
          } else {
            content.topWords[word] = (content.topWords[word] || 0) + 1;
          }
        });
      }
    });

    content.averageMessageLength =
      content.messageCount > 0 ? content.totalLength / content.messageCount : 0;

    return content;
  }

  private async analyzeNetwork(chatId: string): Promise<{
    userConnections: Record<string, string[]>;
    influenceScore: Record<string, number>;
    communityClusters: string[][];
    informationFlow: Record<string, Record<string, number>>;
  }> {
    const network = {
      userConnections: {} as Record<string, string[]>,
      influenceScore: {} as Record<string, number>,
      communityClusters: [] as string[][],
      informationFlow: {} as Record<string, Record<string, number>>,
    };

    // Implement network analysis logic here
    return network;
  }
}
