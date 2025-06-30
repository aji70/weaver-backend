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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const discord_analytics_service_1 = require("./discord-analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DiscordAnalyticsController = class DiscordAnalyticsController {
    discordAnalyticsService;
    constructor(discordAnalyticsService) {
        this.discordAnalyticsService = discordAnalyticsService;
    }
    async getServerAnalytics(serverId) {
        return this.discordAnalyticsService.getServerAnalytics(serverId);
    }
    async getChannelAnalytics(serverId) {
        return this.discordAnalyticsService.getChannelAnalytics(serverId);
    }
    async getMemberAnalytics(serverId) {
        return this.discordAnalyticsService.getMemberAnalytics(serverId);
    }
    async getMessageAnalytics(serverId, days = 30) {
        return this.discordAnalyticsService.getMessageAnalytics(serverId, days);
    }
    async getActivityAnalytics(serverId, days = 30) {
        return this.discordAnalyticsService.getActivityAnalytics(serverId, days);
    }
    async getRoleAnalytics(serverId) {
        return this.discordAnalyticsService.getRoleAnalytics(serverId);
    }
    async getEmojiAnalytics(serverId) {
        return this.discordAnalyticsService.getEmojiAnalytics(serverId);
    }
    async getVoiceAnalytics(serverId, days = 30) {
        return this.discordAnalyticsService.getVoiceAnalytics(serverId, days);
    }
    async getReactionAnalytics(serverId, days = 30) {
        return this.discordAnalyticsService.getReactionAnalytics(serverId, days);
    }
    async getBotAnalytics(serverId) {
        return this.discordAnalyticsService.getBotAnalytics(serverId);
    }
    async getInviteAnalytics(serverId) {
        return this.discordAnalyticsService.getInviteAnalytics(serverId);
    }
    async getModerationAnalytics(serverId) {
        return this.discordAnalyticsService.getModerationAnalytics(serverId);
    }
};
exports.DiscordAnalyticsController = DiscordAnalyticsController;
__decorate([
    (0, common_1.Get)('server/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getServerAnalytics", null);
__decorate([
    (0, common_1.Get)('channels/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getChannelAnalytics", null);
__decorate([
    (0, common_1.Get)('members/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getMemberAnalytics", null);
__decorate([
    (0, common_1.Get)('messages/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getMessageAnalytics", null);
__decorate([
    (0, common_1.Get)('activity/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getActivityAnalytics", null);
__decorate([
    (0, common_1.Get)('roles/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getRoleAnalytics", null);
__decorate([
    (0, common_1.Get)('emojis/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getEmojiAnalytics", null);
__decorate([
    (0, common_1.Get)('voice/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getVoiceAnalytics", null);
__decorate([
    (0, common_1.Get)('reactions/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getReactionAnalytics", null);
__decorate([
    (0, common_1.Get)('bots/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getBotAnalytics", null);
__decorate([
    (0, common_1.Get)('invites/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getInviteAnalytics", null);
__decorate([
    (0, common_1.Get)('moderation/:serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscordAnalyticsController.prototype, "getModerationAnalytics", null);
exports.DiscordAnalyticsController = DiscordAnalyticsController = __decorate([
    (0, common_1.Controller)('discord-analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [discord_analytics_service_1.DiscordAnalyticsService])
], DiscordAnalyticsController);
//# sourceMappingURL=discord-analytics.controller.js.map