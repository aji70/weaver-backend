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
exports.RewardDistributionController = void 0;
const common_1 = require("@nestjs/common");
const reward_distribution_service_1 = require("./reward-distribution.service");
const assign_reward_dto_1 = require("./dto/assign-reward.dto");
const claim_reward_dto_1 = require("./dto/claim-reward.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const reward_entity_1 = require("./entities/reward.entity");
const reward_claim_entity_1 = require("./entities/reward-claim.entity");
let RewardDistributionController = class RewardDistributionController {
    rewardDistributionService;
    constructor(rewardDistributionService) {
        this.rewardDistributionService = rewardDistributionService;
    }
    async assignReward(assignRewardDto) {
        return this.rewardDistributionService.assignReward(assignRewardDto);
    }
    async claimReward(req, claimRewardDto) {
        return this.rewardDistributionService.claimReward(req.user.id, claimRewardDto);
    }
    async getUserRewardHistory(userId, status) {
        return this.rewardDistributionService.getUserRewardHistory(userId, status);
    }
    async getRewardClaims(rewardId, status) {
        return this.rewardDistributionService.getRewardClaims(rewardId, status);
    }
    async batchProcessClaims(body) {
        await this.rewardDistributionService.batchProcessClaims(body.claimIds);
        return { message: 'Batch processing started' };
    }
};
exports.RewardDistributionController = RewardDistributionController;
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_reward_dto_1.AssignRewardDto]),
    __metadata("design:returntype", Promise)
], RewardDistributionController.prototype, "assignReward", null);
__decorate([
    (0, common_1.Post)('claim'),
    (0, roles_decorator_1.Roles)('user', 'admin', 'moderator'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, claim_reward_dto_1.ClaimRewardDto]),
    __metadata("design:returntype", Promise)
], RewardDistributionController.prototype, "claimReward", null);
__decorate([
    (0, common_1.Get)('history/:userId'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RewardDistributionController.prototype, "getUserRewardHistory", null);
__decorate([
    (0, common_1.Get)('claims/:rewardId'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('rewardId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RewardDistributionController.prototype, "getRewardClaims", null);
__decorate([
    (0, common_1.Post)('batch-process'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RewardDistributionController.prototype, "batchProcessClaims", null);
exports.RewardDistributionController = RewardDistributionController = __decorate([
    (0, common_1.Controller)('rewards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reward_distribution_service_1.RewardDistributionService])
], RewardDistributionController);
//# sourceMappingURL=reward-distribution.controller.js.map