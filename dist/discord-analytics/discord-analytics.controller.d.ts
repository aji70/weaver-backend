import { DiscordAnalyticsService } from './discord-analytics.service';
export declare class DiscordAnalyticsController {
    private readonly discordAnalyticsService;
    constructor(discordAnalyticsService: DiscordAnalyticsService);
    getServerAnalytics(serverId: string): Promise<{
        basicInfo: {
            name: any;
            id: any;
            owner: any;
            memberCount: any;
            channelCount: any;
            roleCount: any;
            emojiCount: any;
            createdAt: any;
            premiumTier: any;
            premiumSubscriptionCount: any;
            verificationLevel: any;
            features: any;
        };
        boostStatus: {
            level: any;
            boostCount: any;
            boosters: any;
        };
        region: any;
        systemChannel: any;
        rulesChannel: any;
        publicUpdatesChannel: any;
    }>;
    getChannelAnalytics(serverId: string): Promise<{
        total: number;
        byType: {
            text: number;
            voice: number;
            category: number;
            news: number;
            forum: number;
        };
        categories: Record<string, number>;
        mostActive: import("./discord-analytics.service").ChannelActivity[];
        leastActive: import("./discord-analytics.service").ChannelActivity[];
    }>;
    getMemberAnalytics(serverId: string): Promise<{
        total: number;
        online: number;
        idle: number;
        dnd: number;
        offline: number;
        bots: number;
        humans: number;
        byRole: Record<string, number>;
        joinDates: {
            today: number;
            week: number;
            month: number;
        };
        topMembers: import("./discord-analytics.service").MemberActivity[];
    }>;
    getMessageAnalytics(serverId: string, days?: number): Promise<{
        total: number;
        byChannel: Record<string, number>;
        byUser: Record<string, number>;
        byHour: number[];
        byDay: number[];
        topWords: import("./discord-analytics.service").TopItem[];
        topEmojis: import("./discord-analytics.service").TopItem[];
        topMentions: import("./discord-analytics.service").TopItem[];
        topLinks: number;
        topAttachments: number;
    }>;
    getActivityAnalytics(serverId: string, days?: number): Promise<import("./discord-analytics.service").ActivityStats>;
    getRoleAnalytics(serverId: string): Promise<{
        total: any;
        byColor: {};
        byPosition: {};
        memberCount: {};
        permissions: {};
        managed: any;
        hoisted: any;
        mentionable: any;
    }>;
    getEmojiAnalytics(serverId: string): Promise<{
        total: any;
        animated: any;
        static: any;
        byName: {};
        usage: {};
    }>;
    getVoiceAnalytics(serverId: string, days?: number): Promise<any>;
    getReactionAnalytics(serverId: string, days?: number): Promise<any>;
    getBotAnalytics(serverId: string): Promise<import("./discord-analytics.service").BotStats>;
    getInviteAnalytics(serverId: string): Promise<import("./discord-analytics.service").InviteStats>;
    getModerationAnalytics(serverId: string): Promise<import("./discord-analytics.service").ModerationStats>;
}
