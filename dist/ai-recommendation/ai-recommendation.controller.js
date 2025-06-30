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
exports.AiRecommendationController = void 0;
const common_1 = require("@nestjs/common");
const ai_recommendation_service_1 = require("./ai-recommendation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const alert_entity_1 = require("./entities/alert.entity");
let AiRecommendationController = class AiRecommendationController {
    aiRecommendationService;
    constructor(aiRecommendationService) {
        this.aiRecommendationService = aiRecommendationService;
    }
    async getCampaignRecommendations(campaignId) {
        return this.aiRecommendationService.getCampaignRecommendations(campaignId);
    }
    async getAlerts(type, severity, resolved) {
        return this.aiRecommendationService.getAlerts(type, severity, resolved);
    }
    async markRecommendationAsRead(id) {
        return this.aiRecommendationService.markRecommendationAsRead(id);
    }
    async markRecommendationAsApplied(id) {
        return this.aiRecommendationService.markRecommendationAsApplied(id);
    }
    async resolveAlert(id) {
        return this.aiRecommendationService.resolveAlert(id);
    }
    async triggerUserAnalysis(userId) {
        await this.aiRecommendationService.triggerUserAnalysis(userId);
        return { message: 'User analysis triggered successfully' };
    }
    async triggerCampaignAnalysis(campaignId) {
        await this.aiRecommendationService.triggerCampaignAnalysis(campaignId);
        return { message: 'Campaign analysis triggered successfully' };
    }
};
exports.AiRecommendationController = AiRecommendationController;
__decorate([
    (0, common_1.Get)('recommendations/:campaignId'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "getCampaignRecommendations", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('resolved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Post)('recommendations/:id/read'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "markRecommendationAsRead", null);
__decorate([
    (0, common_1.Post)('recommendations/:id/apply'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "markRecommendationAsApplied", null);
__decorate([
    (0, common_1.Post)('alerts/:id/resolve'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Post)('analyze/user/:userId'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "triggerUserAnalysis", null);
__decorate([
    (0, common_1.Post)('analyze/campaign/:campaignId'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiRecommendationController.prototype, "triggerCampaignAnalysis", null);
exports.AiRecommendationController = AiRecommendationController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ai_recommendation_service_1.AiRecommendationService])
], AiRecommendationController);
//# sourceMappingURL=ai-recommendation.controller.js.map