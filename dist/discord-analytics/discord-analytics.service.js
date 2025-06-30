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
exports.DiscordAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const discord_js_1 = require("discord.js");
const date_fns_1 = require("date-fns");
let DiscordAnalyticsService = class DiscordAnalyticsService {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
        this.client = new discord_js_1.Client({
            intents: [
                'Guilds',
                'GuildMembers',
                'GuildMessages',
                'GuildVoiceStates',
                'GuildPresences',
                'GuildMessageReactions',
            ],
        });
        this.client.login(this.configService.get('DISCORD_BOT_TOKEN'));
    }
    sortByCount(a, b) {
        return b.count - a.count;
    }
    getTopItems(items, limit = 10) {
        return items.sort(this.sortByCount).slice(0, limit);
    }
    async getServerAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            return {
                basicInfo: {
                    name: guild.name,
                    id: guild.id,
                    owner: guild.ownerId,
                    memberCount: guild.memberCount,
                    channelCount: guild.channels.cache.size,
                    roleCount: guild.roles.cache.size,
                    emojiCount: guild.emojis.cache.size,
                    createdAt: guild.createdAt,
                    premiumTier: guild.premiumTier,
                    premiumSubscriptionCount: guild.premiumSubscriptionCount,
                    verificationLevel: guild.verificationLevel,
                    features: guild.features,
                },
                boostStatus: {
                    level: guild.premiumTier,
                    boostCount: guild.premiumSubscriptionCount,
                    boosters: guild.members.cache.filter((member) => member.premiumSince)
                        .size,
                },
                region: guild.preferredLocale,
                systemChannel: guild.systemChannel?.name,
                rulesChannel: guild.rulesChannel?.name,
                publicUpdatesChannel: guild.publicUpdatesChannel?.name,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch server analytics: ${error.message}`);
        }
    }
    async getChannelAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const channels = guild.channels.cache;
            const channelStats = {
                total: channels.size,
                byType: {
                    text: channels.filter((c) => c.type === discord_js_1.ChannelType.GuildText).size,
                    voice: channels.filter((c) => c.type === discord_js_1.ChannelType.GuildVoice).size,
                    category: channels.filter((c) => c.type === discord_js_1.ChannelType.GuildCategory)
                        .size,
                    news: channels.filter((c) => c.type === discord_js_1.ChannelType.GuildAnnouncement)
                        .size,
                    forum: channels.filter((c) => c.type === discord_js_1.ChannelType.GuildForum).size,
                },
                categories: {},
                mostActive: [],
                leastActive: [],
            };
            channels.forEach((channel) => {
                const parentName = channel.parent?.name;
                if (parentName) {
                    channelStats.categories[parentName] =
                        (channelStats.categories[parentName] || 0) + 1;
                }
            });
            const textChannels = channels.filter((c) => c.type === discord_js_1.ChannelType.GuildText && c instanceof discord_js_1.TextChannel);
            const channelActivity = await Promise.all(Array.from(textChannels.values()).map(async (channel) => {
                const messages = await channel.messages.fetch({ limit: 100 });
                return {
                    id: channel.id,
                    name: channel.name || 'Unnamed Channel',
                    messageCount: messages.size,
                };
            }));
            channelStats.mostActive = channelActivity
                .sort((a, b) => b.messageCount - a.messageCount)
                .slice(0, 5);
            channelStats.leastActive = channelActivity
                .sort((a, b) => a.messageCount - b.messageCount)
                .slice(0, 5);
            return channelStats;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to fetch channel analytics: ${errorMessage}`);
        }
    }
    async getMemberAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const members = guild.members.cache;
            const memberStats = {
                total: members.size,
                online: members.filter((m) => m.presence?.status === 'online').size,
                idle: members.filter((m) => m.presence?.status === 'idle').size,
                dnd: members.filter((m) => m.presence?.status === 'dnd').size,
                offline: members.filter((m) => m.presence?.status === 'offline').size,
                bots: members.filter((m) => m.user.bot).size,
                humans: members.filter((m) => !m.user.bot).size,
                byRole: {},
                joinDates: {
                    today: members.filter((m) => m.joinedAt && (0, date_fns_1.differenceInDays)(new Date(), m.joinedAt) === 0).size,
                    week: members.filter((m) => m.joinedAt && (0, date_fns_1.differenceInDays)(new Date(), m.joinedAt) <= 7).size,
                    month: members.filter((m) => m.joinedAt && (0, date_fns_1.differenceInDays)(new Date(), m.joinedAt) <= 30).size,
                },
                topMembers: [],
            };
            members.forEach((member) => {
                member.roles.cache.forEach((role) => {
                    if (role.name) {
                        memberStats.byRole[role.name] =
                            (memberStats.byRole[role.name] || 0) + 1;
                    }
                });
            });
            const memberActivity = await Promise.all(Array.from(members.filter((m) => !m.user.bot).values()).map(async (member) => {
                const textChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.TextChannel);
                const messages = await Array.from(textChannels.values()).reduce(async (acc, channel) => {
                    const channelMessages = await channel.messages.fetch({
                        limit: 100,
                    });
                    return ((await acc) +
                        channelMessages.filter((m) => m.author.id === member.id).size);
                }, Promise.resolve(0));
                return {
                    id: member.id,
                    username: member.user.username,
                    messageCount: messages,
                    joinedAt: member.joinedAt,
                    roles: member.roles.cache.map((r) => r.name || 'Unknown Role'),
                };
            }));
            memberStats.topMembers = memberActivity
                .sort((a, b) => b.messageCount - a.messageCount)
                .slice(0, 10);
            return memberStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch member analytics: ${error.message}`);
        }
    }
    async getMessageAnalytics(serverId, days = 30) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const since = (0, date_fns_1.subDays)(new Date(), days);
            const messageStats = {
                total: 0,
                byChannel: {},
                byUser: {},
                byHour: Array(24).fill(0),
                byDay: Array(7).fill(0),
                topWords: {},
                topEmojis: {},
                topMentions: {},
                topLinks: 0,
                topAttachments: 0,
            };
            const textChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.TextChannel);
            for (const channel of textChannels.values()) {
                const messages = await channel.messages.fetch({ limit: 100 });
                messages.forEach((message) => {
                    if (message.createdAt >= since) {
                        messageStats.total++;
                        if (channel.name) {
                            messageStats.byChannel[channel.name] =
                                (messageStats.byChannel[channel.name] || 0) + 1;
                        }
                        messageStats.byUser[message.author.username] =
                            (messageStats.byUser[message.author.username] || 0) + 1;
                        const hour = message.createdAt.getHours();
                        const day = message.createdAt.getDay();
                        messageStats.byHour[hour]++;
                        messageStats.byDay[day]++;
                        const words = message.content.split(/\s+/);
                        words.forEach((word) => {
                            if (word) {
                                messageStats.topWords[word] =
                                    (messageStats.topWords[word] || 0) + 1;
                            }
                        });
                        message.reactions.cache.forEach((reaction) => {
                            const emojiName = reaction.emoji.name;
                            if (emojiName) {
                                messageStats.topEmojis[emojiName] =
                                    (messageStats.topEmojis[emojiName] || 0) + reaction.count;
                            }
                        });
                        message.mentions.users.forEach((user) => {
                            messageStats.topMentions[user.username] =
                                (messageStats.topMentions[user.username] || 0) + 1;
                        });
                        if (message.content.match(/https?:\/\/[^\s]+/)) {
                            messageStats.topLinks++;
                        }
                        if (message.attachments.size > 0) {
                            messageStats.topAttachments++;
                        }
                    }
                });
            }
            return {
                ...messageStats,
                topWords: Object.entries(messageStats.topWords)
                    .map(([word, count]) => ({ item: word, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
                topEmojis: Object.entries(messageStats.topEmojis)
                    .map(([emoji, count]) => ({ item: emoji, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
                topMentions: Object.entries(messageStats.topMentions)
                    .map(([user, count]) => ({ item: user, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10),
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch message analytics: ${error.message}`);
        }
    }
    async getActivityAnalytics(serverId, days = 30) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const members = guild.members.cache;
            const since = (0, date_fns_1.subDays)(new Date(), days);
            const activityStats = {
                totalMessages: 0,
                totalVoiceTime: 0,
                activeMembers: 0,
                topChannels: [],
                topMembers: [],
            };
            const textChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.TextChannel);
            const channelStats = new Map();
            for (const channel of textChannels.values()) {
                const messages = await channel.messages.fetch({ limit: 100 });
                const recentMessages = messages.filter((m) => m.createdAt >= since);
                if (recentMessages.size > 0 && channel.name) {
                    channelStats.set(channel.name, recentMessages.size);
                    activityStats.totalMessages += recentMessages.size;
                }
            }
            const voiceChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.VoiceChannel);
            const memberStats = new Map();
            guild.voiceStates.cache.forEach((state) => {
                if (state.channelId && state.member) {
                    const username = state.member.user.username;
                    const stats = memberStats.get(username) || {
                        messages: 0,
                        voiceTime: 0,
                    };
                    memberStats.set(username, stats);
                }
            });
            activityStats.topChannels = Array.from(channelStats.entries())
                .map(([name, messageCount]) => ({ name, messageCount }))
                .sort((a, b) => b.messageCount - a.messageCount)
                .slice(0, 10);
            activityStats.topMembers = Array.from(memberStats.entries())
                .map(([username, stats]) => ({
                username,
                messageCount: stats.messages,
                voiceTime: stats.voiceTime,
            }))
                .sort((a, b) => b.messageCount + b.voiceTime - (a.messageCount + a.voiceTime))
                .slice(0, 10);
            activityStats.activeMembers = memberStats.size;
            return activityStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch activity analytics: ${error.message}`);
        }
    }
    async getRoleAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const roles = guild.roles.cache;
            const roleStats = {
                total: roles.size,
                byColor: {},
                byPosition: {},
                memberCount: {},
                permissions: {},
                managed: roles.filter((r) => r.managed).size,
                hoisted: roles.filter((r) => r.hoist).size,
                mentionable: roles.filter((r) => r.mentionable).size,
            };
            roles.forEach((role) => {
                roleStats.byColor[role.hexColor] =
                    (roleStats.byColor[role.hexColor] || 0) + 1;
                roleStats.byPosition[role.position] =
                    (roleStats.byPosition[role.position] || 0) + 1;
                roleStats.memberCount[role.name] = role.members.size;
                const permissions = role.permissions.toArray();
                permissions.forEach((permission) => {
                    roleStats.permissions[permission] =
                        (roleStats.permissions[permission] || 0) + 1;
                });
            });
            return roleStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch role analytics: ${error.message}`);
        }
    }
    async getEmojiAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const emojis = guild.emojis.cache;
            const emojiStats = {
                total: emojis.size,
                animated: emojis.filter((e) => e.animated).size,
                static: emojis.filter((e) => !e.animated).size,
                byName: {},
                usage: {},
            };
            emojis.forEach((emoji) => {
                emojiStats.byName[emoji.name] = {
                    id: emoji.id,
                    animated: emoji.animated,
                    url: emoji.url,
                    createdAt: emoji.createdAt,
                };
            });
            const textChannels = guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT');
            for (const channel of textChannels.values()) {
                let messages = await channel.messages.fetch({ limit: 100 });
                while (messages.size > 0) {
                    messages.forEach((message) => {
                        const emojiRegex = /<a?:.+?:\d+>/g;
                        const emojis = message.content.match(emojiRegex) || [];
                        emojis.forEach((emoji) => {
                            emojiStats.usage[emoji] = (emojiStats.usage[emoji] || 0) + 1;
                        });
                    });
                    if (messages.size === 100) {
                        messages = await channel.messages.fetch({
                            limit: 100,
                            before: messages.last().id,
                        });
                    }
                    else {
                        break;
                    }
                }
            }
            return emojiStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch emoji analytics: ${error.message}`);
        }
    }
    async getVoiceAnalytics(guildId) {
        try {
            const guild = await this.client.guilds.fetch(guildId);
            const voiceStates = guild.voiceStates.cache;
            const voiceChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.VoiceChannel);
            const voiceStats = {
                totalUsersInVoice: voiceStates.size,
                channelsInUse: new Set(),
                usersByChannel: new Map(),
                channelStats: [],
            };
            voiceStates.forEach((state) => {
                if (state.channelId) {
                    voiceStats.channelsInUse.add(state.channelId);
                    const currentCount = voiceStats.usersByChannel.get(state.channelId) || 0;
                    voiceStats.usersByChannel.set(state.channelId, currentCount + 1);
                }
            });
            voiceStats.channelStats = Array.from(voiceStats.usersByChannel.entries())
                .map(([channelId, userCount]) => {
                const channel = voiceChannels.get(channelId);
                return {
                    channelId,
                    channelName: channel?.name || 'Unknown Channel',
                    userCount,
                };
            })
                .sort((a, b) => b.userCount - a.userCount);
            return {
                totalUsersInVoice: voiceStats.totalUsersInVoice,
                channelsInUse: Array.from(voiceStats.channelsInUse),
                channelStats: voiceStats.channelStats,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch voice analytics: ${error.message}`);
        }
    }
    async getReactionAnalytics(guildId) {
        try {
            const guild = await this.client.guilds.fetch(guildId);
            const channels = await guild.channels.fetch();
            const reactionStats = new Map();
            for (const [, channel] of channels) {
                if (channel instanceof discord_js_1.BaseGuildTextChannel) {
                    const messages = await channel.messages.fetch({ limit: 100 });
                    messages.forEach((message) => {
                        message.reactions.cache.forEach((reaction) => {
                            const emojiName = reaction.emoji.name;
                            if (emojiName) {
                                reactionStats.set(emojiName, (reactionStats.get(emojiName) || 0) + reaction.count);
                            }
                        });
                    });
                }
            }
            return {
                totalReactions: reactionStats.size,
                topReactions: Array.from(reactionStats.entries())
                    .map(([emoji, count]) => ({ emoji, count }))
                    .sort(this.sortByCount)
                    .slice(0, 10),
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch reaction analytics: ${error.message}`);
        }
    }
    async getBotAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const bots = guild.members.cache.filter((m) => m.user.bot);
            const botStats = {
                total: bots.size,
                online: bots.filter((b) => b.presence?.status === 'online').size,
                offline: bots.filter((b) => !b.presence || b.presence.status === 'offline').size,
                byPermission: {},
                topCommands: [],
            };
            bots.forEach((bot) => {
                bot.permissions.toArray().forEach((permission) => {
                    botStats.byPermission[permission] =
                        (botStats.byPermission[permission] || 0) + 1;
                });
            });
            const textChannels = guild.channels.cache.filter((c) => c instanceof discord_js_1.TextChannel);
            const commandCounts = new Map();
            for (const channel of textChannels.values()) {
                const messages = await channel.messages.fetch({ limit: 100 });
                messages.forEach((message) => {
                    if (message.author.bot && message.content.startsWith('!')) {
                        const command = message.content.split(' ')[0].slice(1);
                        commandCounts.set(command, (commandCounts.get(command) || 0) + 1);
                    }
                });
            }
            botStats.topCommands = Array.from(commandCounts.entries())
                .map(([command, count]) => ({ command, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            return botStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch bot analytics: ${error.message}`);
        }
    }
    async getInviteAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const invites = await guild.invites.fetch();
            const inviteStats = {
                total: invites.size,
                active: 0,
                expired: 0,
                byChannel: {},
                byInviter: {},
                topInvites: [],
            };
            invites.forEach((invite) => {
                if (invite.maxAge === 0 ||
                    (invite.maxAge &&
                        invite.createdTimestamp &&
                        (Date.now() - invite.createdTimestamp) / 1000 < invite.maxAge)) {
                    inviteStats.active++;
                }
                else {
                    inviteStats.expired++;
                }
                if (invite.channel?.name) {
                    inviteStats.byChannel[invite.channel.name] =
                        (inviteStats.byChannel[invite.channel.name] || 0) + 1;
                }
                if (invite.inviter?.username) {
                    inviteStats.byInviter[invite.inviter.username] =
                        (inviteStats.byInviter[invite.inviter.username] || 0) +
                            (invite.uses || 0);
                }
            });
            inviteStats.topInvites = Array.from(invites.values())
                .map((invite) => ({
                code: invite.code,
                uses: invite.uses || 0,
                inviter: invite.inviter?.username || 'Unknown',
                channel: invite.channel?.name || 'Unknown',
                maxAge: invite.maxAge || 0,
            }))
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 10);
            return inviteStats;
        }
        catch (error) {
            throw new Error(`Failed to fetch invite analytics: ${error.message}`);
        }
    }
    async getModerationAnalytics(serverId) {
        try {
            const guild = await this.client.guilds.fetch(serverId);
            const auditLogs = await guild.fetchAuditLogs();
            const moderationStats = {
                total: auditLogs.entries.size,
                byAction: {},
                byModerator: {},
                recentActions: [],
            };
            auditLogs.entries.forEach((log) => {
                const actionType = discord_js_1.AuditLogEvent[log.action]
                    ? discord_js_1.AuditLogEvent[log.action].toString()
                    : String(log.action);
                const moderator = log.executor?.username || 'Unknown';
                const target = log.target
                    ? 'username' in log.target
                        ? log.target.username
                        : 'name' in log.target
                            ? log.target.name
                            : 'Unknown'
                    : 'Unknown';
                moderationStats.byAction[actionType] =
                    (moderationStats.byAction[actionType] || 0) + 1;
                moderationStats.byModerator[moderator] =
                    (moderationStats.byModerator[moderator] || 0) + 1;
                moderationStats.recentActions.push({
                    action: actionType,
                    moderator,
                    target,
                    reason: log.reason || null,
                    createdAt: log.createdAt,
                });
            });
            moderationStats.recentActions = moderationStats.recentActions
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 10);
            return moderationStats;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to fetch moderation analytics: ${errorMessage}`);
        }
    }
};
exports.DiscordAnalyticsService = DiscordAnalyticsService;
exports.DiscordAnalyticsService = DiscordAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DiscordAnalyticsService);
//# sourceMappingURL=discord-analytics.service.js.map