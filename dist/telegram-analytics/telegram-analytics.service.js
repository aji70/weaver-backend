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
exports.TelegramAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
let TelegramAnalyticsService = class TelegramAnalyticsService {
    configService;
    client;
    stringSession;
    constructor(configService) {
        this.configService = configService;
        this.stringSession = new sessions_1.StringSession('');
        this.client = new telegram_1.TelegramClient(this.stringSession, this.configService.get('TELEGRAM_API_ID'), this.configService.get('TELEGRAM_API_HASH'), { connectionRetries: 5 });
    }
    async initialize() {
        await this.client.connect();
        await this.client.signIn({
            phoneNumber: this.configService.get('TELEGRAM_PHONE'),
            password: async () => this.configService.get('TELEGRAM_PASSWORD'),
            phoneCode: async () => this.configService.get('TELEGRAM_CODE'),
            onError: (err) => console.log(err),
        });
    }
    async getMessageAnalytics(chatId, days = 30) {
        const messages = await this.client.getMessages(chatId, {
            limit: 1000,
            offsetDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        });
        const analytics = {
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
    categorizeMessagesByType(messages) {
        const types = {
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
                if (msg.media.className === 'MessageMediaPhoto')
                    types.photo++;
                else if (msg.media.className === 'MessageMediaDocument') {
                    const doc = msg.media.document;
                    if (doc.mimeType.startsWith('video/'))
                        types.video++;
                    else
                        types.document++;
                }
            }
            else if (msg.message)
                types.text++;
            else if (msg.sticker)
                types.sticker++;
            else if (msg.voice)
                types.voice++;
            else if (msg.geo)
                types.location++;
            else if (msg.poll)
                types.poll++;
            else
                types.other++;
        });
        return types;
    }
    analyzeMessageTiming(messages) {
        const hourlyDistribution = {};
        for (let i = 0; i < 24; i++)
            hourlyDistribution[i] = 0;
        messages.forEach((msg) => {
            const hour = new Date(msg.date * 1000).getHours();
            hourlyDistribution[hour]++;
        });
        return hourlyDistribution;
    }
    analyzeUserActivity(messages) {
        const userActivity = {};
        messages.forEach((msg) => {
            const userId = msg.fromId?.toString() || 'unknown';
            userActivity[userId] = (userActivity[userId] || 0) + 1;
        });
        return userActivity;
    }
    analyzeMediaContent(messages) {
        const mediaStats = {
            total: 0,
            byType: {},
            averageSize: 0,
            topSenders: {},
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
    analyzeMessageLanguages(messages) {
        const languageStats = {};
        return languageStats;
    }
    analyzeMessageSentiment(messages) {
        return {
            positive: 0,
            negative: 0,
            neutral: 0,
            average: 0,
        };
    }
    async analyzeUserStats(chatId) {
        const participants = await this.client.getParticipants(chatId);
        const stats = {
            total: participants.length,
            active: 0,
            byRole: {},
            joinDates: {},
            activityLevels: {},
        };
        participants.forEach((participant) => {
            if (participant.status) {
                stats.byRole[participant.status.className] =
                    (stats.byRole[participant.status.className] || 0) + 1;
            }
        });
        return stats;
    }
    analyzeEngagement(messages) {
        const engagement = {
            reactions: {},
            forwards: 0,
            replies: 0,
            averageResponseTime: 0,
            peakActivityTimes: [],
        };
        messages.forEach((msg) => {
            if (msg.replies)
                engagement.replies++;
            if (msg.forwards)
                engagement.forwards += msg.forwards;
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
    analyzeContent(messages) {
        const content = {
            topWords: {},
            topHashtags: {},
            topMentions: {},
            topLinks: {},
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
                    }
                    else if (word.startsWith('@')) {
                        content.topMentions[word] = (content.topMentions[word] || 0) + 1;
                    }
                    else if (word.match(/https?:\/\/.+/)) {
                        content.topLinks[word] = (content.topLinks[word] || 0) + 1;
                    }
                    else {
                        content.topWords[word] = (content.topWords[word] || 0) + 1;
                    }
                });
            }
        });
        content.averageMessageLength =
            content.messageCount > 0 ? content.totalLength / content.messageCount : 0;
        return content;
    }
    async analyzeNetwork(chatId) {
        const network = {
            userConnections: {},
            influenceScore: {},
            communityClusters: [],
            informationFlow: {},
        };
        return network;
    }
};
exports.TelegramAnalyticsService = TelegramAnalyticsService;
exports.TelegramAnalyticsService = TelegramAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramAnalyticsService);
//# sourceMappingURL=telegram-analytics.service.js.map