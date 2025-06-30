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
exports.ProtocolHealthController = void 0;
const common_1 = require("@nestjs/common");
const protocol_health_service_1 = require("./protocol-health.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ProtocolHealthController = class ProtocolHealthController {
    protocolHealthService;
    constructor(protocolHealthService) {
        this.protocolHealthService = protocolHealthService;
    }
    async getProtocolHealth(protocolId) {
        return this.protocolHealthService.getProtocolHealth(protocolId);
    }
    async getProtocolHealthHistory(protocolId, days) {
        return this.protocolHealthService.getProtocolHealthHistory(protocolId, days);
    }
};
exports.ProtocolHealthController = ProtocolHealthController;
__decorate([
    (0, common_1.Get)(':protocolId/health'),
    __param(0, (0, common_1.Param)('protocolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProtocolHealthController.prototype, "getProtocolHealth", null);
__decorate([
    (0, common_1.Get)(':protocolId/health/history'),
    __param(0, (0, common_1.Param)('protocolId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ProtocolHealthController.prototype, "getProtocolHealthHistory", null);
exports.ProtocolHealthController = ProtocolHealthController = __decorate([
    (0, common_1.Controller)('protocols'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [protocol_health_service_1.ProtocolHealthService])
], ProtocolHealthController);
//# sourceMappingURL=protocol-health.controller.js.map