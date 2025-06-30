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
exports.ReputationEngineController = void 0;
const common_1 = require("@nestjs/common");
const reputation_engine_service_1 = require("./reputation-engine.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ReputationEngineController = class ReputationEngineController {
    reputationService;
    constructor(reputationService) {
        this.reputationService = reputationService;
    }
    async getReputationScore(userId) {
        return this.reputationService.getReputationScore(userId);
    }
    async recalculateScore(userId) {
        await this.reputationService.recalculateScore(userId);
        return this.reputationService.getReputationScore(userId);
    }
};
exports.ReputationEngineController = ReputationEngineController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationEngineController.prototype, "getReputationScore", null);
__decorate([
    (0, common_1.Post)(':userId/recalculate'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationEngineController.prototype, "recalculateScore", null);
exports.ReputationEngineController = ReputationEngineController = __decorate([
    (0, common_1.Controller)('reputation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reputation_engine_service_1.ReputationEngineService])
], ReputationEngineController);
//# sourceMappingURL=reputation-engine.controller.js.map