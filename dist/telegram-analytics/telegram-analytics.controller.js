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
exports.TelegramAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const telegram_analytics_service_1 = require("./telegram-analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TelegramAnalyticsController = class TelegramAnalyticsController {
    telegramAnalyticsService;
    constructor(telegramAnalyticsService) {
        this.telegramAnalyticsService = telegramAnalyticsService;
    }
    async getChatAnalytics(chatId, days = 30) {
        return this.telegramAnalyticsService.getMessageAnalytics(chatId, days);
    }
    async getMessageAnalytics(chatId, days = 30) {
        const analytics = await this.telegramAnalyticsService.getMessageAnalytics(chatId, days);
        return analytics.messageStats;
    }
    async getUserAnalytics(chatId) {
        const analytics = await this.telegramAnalyticsService.getMessageAnalytics(chatId);
        return analytics.userStats;
    }
    async getEngagementAnalytics(chatId, days = 30) {
        const analytics = await this.telegramAnalyticsService.getMessageAnalytics(chatId, days);
        return analytics.engagementStats;
    }
    async getContentAnalytics(chatId, days = 30) {
        const analytics = await this.telegramAnalyticsService.getMessageAnalytics(chatId, days);
        return analytics.contentStats;
    }
    async getNetworkAnalytics(chatId) {
        const analytics = await this.telegramAnalyticsService.getMessageAnalytics(chatId);
        return analytics.networkStats;
    }
};
exports.TelegramAnalyticsController = TelegramAnalyticsController;
__decorate([
    (0, common_1.Get)('chat/:chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive analytics for a Telegram chat' }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to analyze',
        type: Number,
    }),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getChatAnalytics", null);
__decorate([
    (0, common_1.Get)('chat/:chatId/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get message-specific analytics for a Telegram chat',
    }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to analyze',
        type: Number,
    }),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getMessageAnalytics", null);
__decorate([
    (0, common_1.Get)('chat/:chatId/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user-specific analytics for a Telegram chat' }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('chat/:chatId/engagement'),
    (0, swagger_1.ApiOperation)({ summary: 'Get engagement metrics for a Telegram chat' }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to analyze',
        type: Number,
    }),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getEngagementAnalytics", null);
__decorate([
    (0, common_1.Get)('chat/:chatId/content'),
    (0, swagger_1.ApiOperation)({ summary: 'Get content analysis for a Telegram chat' }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to analyze',
        type: Number,
    }),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getContentAnalytics", null);
__decorate([
    (0, common_1.Get)('chat/:chatId/network'),
    (0, swagger_1.ApiOperation)({ summary: 'Get network analysis for a Telegram chat' }),
    (0, swagger_1.ApiParam)({ name: 'chatId', description: 'Telegram chat ID' }),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramAnalyticsController.prototype, "getNetworkAnalytics", null);
exports.TelegramAnalyticsController = TelegramAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Telegram Analytics'),
    (0, common_1.Controller)('telegram-analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [telegram_analytics_service_1.TelegramAnalyticsService])
], TelegramAnalyticsController);
//# sourceMappingURL=telegram-analytics.controller.js.map