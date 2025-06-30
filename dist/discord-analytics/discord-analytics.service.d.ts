import { ConfigService } from '@nestjs/config';
export interface ChannelActivity {
    id: string;
    name: string;
    messageCount: number;
}
export interface MemberActivity {
    id: string;
    username: string;
    messageCount: number;
    joinedAt: Date | null;
    roles: string[];
}
export interface TopItem {
    item: string;
    count: number;
}
export interface ActivityStats {
    totalMessages: number;
    totalVoiceTime: number;
    activeMembers: number;
    topChannels: {
        name: string;
        messageCount: number;
    }[];
    topMembers: {
        username: string;
        messageCount: number;
        voiceTime: number;
    }[];
}
export interface ModerationStats {
    total: number;
    byAction: Record<string, number>;
    byModerator: Record<string, number>;
    recentActions: {
        action: string;
        moderator: string;
        target: string;
        reason: string | null;
        createdAt: Date;
    }[];
}
export interface BotStats {
    total: number;
    online: number;
    offline: number;
    byPermission: Record<string, number>;
    topCommands: {
        command: string;
        count: number;
    }[];
}
export interface InviteStats {
    total: number;
    active: number;
    expired: number;
    byChannel: Record<string, number>;
    byInviter: Record<string, number>;
    topInvites: {
        code: string;
        uses: number;
        inviter: string;
        channel: string;
        maxAge: number;
    }[];
}
export declare class DiscordAnalyticsService {
    private configService;
    private client;
    constructor(configService: ConfigService);
    private sortByCount;
    private getTopItems;
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
        mostActive: ChannelActivity[];
        leastActive: ChannelActivity[];
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
        topMembers: MemberActivity[];
    }>;
    getMessageAnalytics(serverId: string, days?: number): Promise<{
        total: number;
        byChannel: Record<string, number>;
        byUser: Record<string, number>;
        byHour: number[];
        byDay: number[];
        topWords: TopItem[];
        topEmojis: TopItem[];
        topMentions: TopItem[];
        topLinks: number;
        topAttachments: number;
    }>;
    getActivityAnalytics(serverId: string, days?: number): Promise<ActivityStats>;
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
    getVoiceAnalytics(guildId: string): Promise<any>;
    getReactionAnalytics(guildId: string): Promise<any>;
    getBotAnalytics(serverId: string): Promise<BotStats>;
    getInviteAnalytics(serverId: string): Promise<InviteStats>;
    getModerationAnalytics(serverId: string): Promise<ModerationStats>;
}
