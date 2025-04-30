import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  Guild,
  Channel,
  GuildMember,
  Message,
  Role,
  Emoji,
  VoiceState,
  Collection,
  TextChannel,
  VoiceChannel,
  ChannelType,
  BaseGuildTextChannel,
  AuditLogEvent,
  GuildBasedChannel,
} from 'discord.js';
import { subDays, format, differenceInDays } from 'date-fns';

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
  topCommands: { command: string; count: number }[];
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

@Injectable()
export class DiscordAnalyticsService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'GuildVoiceStates',
        'GuildPresences',
        'GuildMessageReactions',
      ],
    });

    this.client.login(this.configService.get<string>('DISCORD_BOT_TOKEN'));
  }

  private sortByCount<T extends { count: number }>(a: T, b: T): number {
    return b.count - a.count;
  }

  private getTopItems<T extends { count: number }>(
    items: T[],
    limit: number = 10,
  ): T[] {
    return items.sort(this.sortByCount).slice(0, limit);
  }

  async getServerAnalytics(serverId: string) {
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
    } catch (error) {
      throw new Error(`Failed to fetch server analytics: ${error.message}`);
    }
  }

  async getChannelAnalytics(serverId: string): Promise<{
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
  }> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const channels = guild.channels.cache;

      const channelStats = {
        total: channels.size,
        byType: {
          text: channels.filter((c) => c.type === ChannelType.GuildText).size,
          voice: channels.filter((c) => c.type === ChannelType.GuildVoice).size,
          category: channels.filter((c) => c.type === ChannelType.GuildCategory)
            .size,
          news: channels.filter((c) => c.type === ChannelType.GuildAnnouncement)
            .size,
          forum: channels.filter((c) => c.type === ChannelType.GuildForum).size,
        },
        categories: {} as Record<string, number>,
        mostActive: [] as ChannelActivity[],
        leastActive: [] as ChannelActivity[],
      };

      // Group channels by category
      channels.forEach((channel) => {
        const parentName = channel.parent?.name;
        if (parentName) {
          channelStats.categories[parentName] =
            (channelStats.categories[parentName] || 0) + 1;
        }
      });

      // Get most and least active channels
      const textChannels = channels.filter(
        (c): c is TextChannel =>
          c.type === ChannelType.GuildText && c instanceof TextChannel,
      );

      const channelActivity = await Promise.all(
        Array.from(textChannels.values()).map(async (channel) => {
          const messages = await channel.messages.fetch({ limit: 100 });
          return {
            id: channel.id,
            name: channel.name || 'Unnamed Channel',
            messageCount: messages.size,
          };
        }),
      );

      channelStats.mostActive = channelActivity
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);
      channelStats.leastActive = channelActivity
        .sort((a, b) => a.messageCount - b.messageCount)
        .slice(0, 5);

      return channelStats;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch channel analytics: ${errorMessage}`);
    }
  }

  async getMemberAnalytics(serverId: string): Promise<{
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
  }> {
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
        byRole: {} as Record<string, number>,
        joinDates: {
          today: members.filter(
            (m) => m.joinedAt && differenceInDays(new Date(), m.joinedAt) === 0,
          ).size,
          week: members.filter(
            (m) => m.joinedAt && differenceInDays(new Date(), m.joinedAt) <= 7,
          ).size,
          month: members.filter(
            (m) => m.joinedAt && differenceInDays(new Date(), m.joinedAt) <= 30,
          ).size,
        },
        topMembers: [] as MemberActivity[],
      };

      // Count members by role
      members.forEach((member) => {
        member.roles.cache.forEach((role) => {
          if (role.name) {
            memberStats.byRole[role.name] =
              (memberStats.byRole[role.name] || 0) + 1;
          }
        });
      });

      // Get top members by activity
      const memberActivity = await Promise.all(
        Array.from(members.filter((m) => !m.user.bot).values()).map(
          async (member) => {
            const textChannels = guild.channels.cache.filter(
              (c): c is TextChannel => c instanceof TextChannel,
            );

            const messages = await Array.from(textChannels.values()).reduce(
              async (acc, channel) => {
                const channelMessages = await channel.messages.fetch({
                  limit: 100,
                });
                return (
                  (await acc) +
                  channelMessages.filter((m) => m.author.id === member.id).size
                );
              },
              Promise.resolve(0),
            );

            return {
              id: member.id,
              username: member.user.username,
              messageCount: messages,
              joinedAt: member.joinedAt,
              roles: member.roles.cache.map((r) => r.name || 'Unknown Role'),
            };
          },
        ),
      );

      memberStats.topMembers = memberActivity
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 10);

      return memberStats;
    } catch (error) {
      throw new Error(`Failed to fetch member analytics: ${error.message}`);
    }
  }

  async getMessageAnalytics(
    serverId: string,
    days: number = 30,
  ): Promise<{
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
  }> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const since = subDays(new Date(), days);

      interface MessageStats {
        total: number;
        byChannel: Record<string, number>;
        byUser: Record<string, number>;
        byHour: number[];
        byDay: number[];
        topWords: Record<string, number>;
        topEmojis: Record<string, number>;
        topMentions: Record<string, number>;
        topLinks: number;
        topAttachments: number;
      }

      const messageStats: MessageStats = {
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

      const textChannels = guild.channels.cache.filter(
        (c): c is TextChannel => c instanceof TextChannel,
      );

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

            // Count words
            const words = message.content.split(/\s+/);
            words.forEach((word) => {
              if (word) {
                messageStats.topWords[word] =
                  (messageStats.topWords[word] || 0) + 1;
              }
            });

            // Count emojis
            message.reactions.cache.forEach((reaction) => {
              const emojiName = reaction.emoji.name;
              if (emojiName) {
                messageStats.topEmojis[emojiName] =
                  (messageStats.topEmojis[emojiName] || 0) + reaction.count;
              }
            });

            // Count mentions
            message.mentions.users.forEach((user) => {
              messageStats.topMentions[user.username] =
                (messageStats.topMentions[user.username] || 0) + 1;
            });

            // Count links and attachments
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
          .map(([word, count]): TopItem => ({ item: word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topEmojis: Object.entries(messageStats.topEmojis)
          .map(([emoji, count]): TopItem => ({ item: emoji, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topMentions: Object.entries(messageStats.topMentions)
          .map(([user, count]): TopItem => ({ item: user, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      };
    } catch (error) {
      throw new Error(`Failed to fetch message analytics: ${error.message}`);
    }
  }

  async getActivityAnalytics(
    serverId: string,
    days: number = 30,
  ): Promise<ActivityStats> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const members = guild.members.cache;
      const since = subDays(new Date(), days);

      const activityStats: ActivityStats = {
        totalMessages: 0,
        totalVoiceTime: 0,
        activeMembers: 0,
        topChannels: [],
        topMembers: [],
      };

      // Get text channel activity
      const textChannels = guild.channels.cache.filter(
        (c): c is TextChannel => c instanceof TextChannel,
      );

      const channelStats = new Map<string, number>();

      for (const channel of textChannels.values()) {
        const messages = await channel.messages.fetch({ limit: 100 });
        const recentMessages = messages.filter((m) => m.createdAt >= since);

        if (recentMessages.size > 0 && channel.name) {
          channelStats.set(channel.name, recentMessages.size);
          activityStats.totalMessages += recentMessages.size;
        }
      }

      // Get voice channel activity
      const voiceChannels = guild.channels.cache.filter(
        (c): c is VoiceChannel => c instanceof VoiceChannel,
      );

      const memberStats = new Map<
        string,
        { messages: number; voiceTime: number }
      >();

      // Process voice states
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

      // Convert channel stats to array and sort
      activityStats.topChannels = Array.from(channelStats.entries())
        .map(([name, messageCount]) => ({ name, messageCount }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 10);

      // Convert member stats to array and sort
      activityStats.topMembers = Array.from(memberStats.entries())
        .map(([username, stats]) => ({
          username,
          messageCount: stats.messages,
          voiceTime: stats.voiceTime,
        }))
        .sort(
          (a, b) =>
            b.messageCount + b.voiceTime - (a.messageCount + a.voiceTime),
        )
        .slice(0, 10);

      activityStats.activeMembers = memberStats.size;

      return activityStats;
    } catch (error) {
      throw new Error(`Failed to fetch activity analytics: ${error.message}`);
    }
  }

  async getRoleAnalytics(serverId: string) {
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
        // Count by color
        roleStats.byColor[role.hexColor] =
          (roleStats.byColor[role.hexColor] || 0) + 1;

        // Count by position
        roleStats.byPosition[role.position] =
          (roleStats.byPosition[role.position] || 0) + 1;

        // Count members
        roleStats.memberCount[role.name] = role.members.size;

        // Count permissions
        const permissions = role.permissions.toArray();
        permissions.forEach((permission) => {
          roleStats.permissions[permission] =
            (roleStats.permissions[permission] || 0) + 1;
        });
      });

      return roleStats;
    } catch (error) {
      throw new Error(`Failed to fetch role analytics: ${error.message}`);
    }
  }

  async getEmojiAnalytics(serverId: string) {
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

      // Track emoji usage in messages
      const textChannels = guild.channels.cache.filter(
        (c) => c.type === 'GUILD_TEXT',
      );
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
          } else {
            break;
          }
        }
      }

      return emojiStats;
    } catch (error) {
      throw new Error(`Failed to fetch emoji analytics: ${error.message}`);
    }
  }

  async getVoiceAnalytics(guildId: string): Promise<any> {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const voiceStates = guild.voiceStates.cache;
      const voiceChannels = guild.channels.cache.filter(
        (c): c is VoiceChannel => c instanceof VoiceChannel,
      );

      interface VoiceChannelStats {
        channelId: string;
        channelName: string;
        userCount: number;
      }

      const voiceStats = {
        totalUsersInVoice: voiceStates.size,
        channelsInUse: new Set<string>(),
        usersByChannel: new Map<string, number>(),
        channelStats: [] as VoiceChannelStats[],
      };

      voiceStates.forEach((state) => {
        if (state.channelId) {
          voiceStats.channelsInUse.add(state.channelId);
          const currentCount =
            voiceStats.usersByChannel.get(state.channelId) || 0;
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
    } catch (error) {
      throw new Error(`Failed to fetch voice analytics: ${error.message}`);
    }
  }

  async getReactionAnalytics(guildId: string): Promise<any> {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const channels = await guild.channels.fetch();
      const reactionStats = new Map<string, number>();

      for (const [, channel] of channels) {
        if (channel instanceof BaseGuildTextChannel) {
          const messages = await channel.messages.fetch({ limit: 100 });

          messages.forEach((message) => {
            message.reactions.cache.forEach((reaction) => {
              const emojiName = reaction.emoji.name;
              if (emojiName) {
                reactionStats.set(
                  emojiName,
                  (reactionStats.get(emojiName) || 0) + reaction.count,
                );
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
    } catch (error) {
      throw new Error(`Failed to fetch reaction analytics: ${error.message}`);
    }
  }

  async getBotAnalytics(serverId: string): Promise<BotStats> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const bots = guild.members.cache.filter((m) => m.user.bot);

      const botStats: BotStats = {
        total: bots.size,
        online: bots.filter((b) => b.presence?.status === 'online').size,
        offline: bots.filter(
          (b) => !b.presence || b.presence.status === 'offline',
        ).size,
        byPermission: {},
        topCommands: [],
      };

      // Count bots by permission
      bots.forEach((bot) => {
        bot.permissions.toArray().forEach((permission) => {
          botStats.byPermission[permission] =
            (botStats.byPermission[permission] || 0) + 1;
        });
      });

      // Get command usage from text channels
      const textChannels = guild.channels.cache.filter(
        (c): c is TextChannel => c instanceof TextChannel,
      );

      const commandCounts = new Map<string, number>();

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
    } catch (error) {
      throw new Error(`Failed to fetch bot analytics: ${error.message}`);
    }
  }

  async getInviteAnalytics(serverId: string): Promise<InviteStats> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const invites = await guild.invites.fetch();

      const inviteStats: InviteStats = {
        total: invites.size,
        active: 0,
        expired: 0,
        byChannel: {},
        byInviter: {},
        topInvites: [],
      };

      invites.forEach((invite) => {
        // Count active vs expired
        if (
          invite.maxAge === 0 ||
          (invite.maxAge &&
            invite.createdTimestamp &&
            (Date.now() - invite.createdTimestamp) / 1000 < invite.maxAge)
        ) {
          inviteStats.active++;
        } else {
          inviteStats.expired++;
        }

        // Count by channel
        if (invite.channel?.name) {
          inviteStats.byChannel[invite.channel.name] =
            (inviteStats.byChannel[invite.channel.name] || 0) + 1;
        }

        // Count by inviter
        if (invite.inviter?.username) {
          inviteStats.byInviter[invite.inviter.username] =
            (inviteStats.byInviter[invite.inviter.username] || 0) +
            (invite.uses || 0);
        }
      });

      // Get top invites
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
    } catch (error) {
      throw new Error(`Failed to fetch invite analytics: ${error.message}`);
    }
  }

  async getModerationAnalytics(serverId: string): Promise<ModerationStats> {
    try {
      const guild = await this.client.guilds.fetch(serverId);
      const auditLogs = await guild.fetchAuditLogs();

      const moderationStats: ModerationStats = {
        total: auditLogs.entries.size,
        byAction: {} as Record<string, number>,
        byModerator: {} as Record<string, number>,
        recentActions: [],
      };

      auditLogs.entries.forEach((log) => {
        const actionType = AuditLogEvent[log.action]
          ? AuditLogEvent[log.action].toString()
          : String(log.action);
        const moderator = log.executor?.username || 'Unknown';
        const target = log.target
          ? 'username' in log.target
            ? log.target.username
            : 'name' in log.target
              ? log.target.name
              : 'Unknown'
          : 'Unknown';

        // Count by action type
        moderationStats.byAction[actionType] =
          (moderationStats.byAction[actionType] || 0) + 1;

        // Count by moderator
        moderationStats.byModerator[moderator] =
          (moderationStats.byModerator[moderator] || 0) + 1;

        // Add to recent actions
        moderationStats.recentActions.push({
          action: actionType,
          moderator,
          target,
          reason: log.reason || null,
          createdAt: log.createdAt,
        });
      });

      // Sort recent actions by date and limit to last 10
      moderationStats.recentActions = moderationStats.recentActions
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10);

      return moderationStats;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch moderation analytics: ${errorMessage}`);
    }
  }
}
