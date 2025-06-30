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
exports.TwitterAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const x_analytics_service_1 = require("./x-analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TwitterAnalyticsController = class TwitterAnalyticsController {
    twitterAnalyticsService;
    constructor(twitterAnalyticsService) {
        this.twitterAnalyticsService = twitterAnalyticsService;
    }
    async getUserStats(username) {
        return this.twitterAnalyticsService.getUserStats(username);
    }
    async getTweetStats(tweetId) {
        return this.twitterAnalyticsService.getTweetStats(tweetId);
    }
    async getEngagementMetrics(username) {
        return this.twitterAnalyticsService.getEngagementMetrics(username);
    }
};
exports.TwitterAnalyticsController = TwitterAnalyticsController;
__decorate([
    (0, common_1.Get)('user-stats'),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwitterAnalyticsController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('tweet-stats'),
    __param(0, (0, common_1.Query)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwitterAnalyticsController.prototype, "getTweetStats", null);
__decorate([
    (0, common_1.Get)('engagement-metrics'),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwitterAnalyticsController.prototype, "getEngagementMetrics", null);
exports.TwitterAnalyticsController = TwitterAnalyticsController = __decorate([
    (0, common_1.Controller)('twitter-analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [x_analytics_service_1.TwitterAnalyticsService])
], TwitterAnalyticsController);
//# sourceMappingURL=x-analytics.controller.js.map