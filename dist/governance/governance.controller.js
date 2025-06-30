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
exports.GovernanceController = void 0;
const common_1 = require("@nestjs/common");
const governance_service_1 = require("./governance.service");
const create_proposal_dto_1 = require("./dto/create-proposal.dto");
const create_vote_dto_1 = require("./dto/create-vote.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let GovernanceController = class GovernanceController {
    governanceService;
    constructor(governanceService) {
        this.governanceService = governanceService;
    }
    async createProposal(req, createProposalDto) {
        return this.governanceService.createProposal(req.user.id, createProposalDto);
    }
    async submitVote(req, createVoteDto) {
        return this.governanceService.submitVote(req.user.id, createVoteDto);
    }
    async getProposalResults(proposalId) {
        return this.governanceService.getProposalResults(proposalId);
    }
    async closeProposal(proposalId) {
        return this.governanceService.closeProposal(proposalId);
    }
};
exports.GovernanceController = GovernanceController;
__decorate([
    (0, common_1.Post)('proposals'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_proposal_dto_1.CreateProposalDto]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "createProposal", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, roles_decorator_1.Roles)('user', 'admin', 'moderator'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_vote_dto_1.CreateVoteDto]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "submitVote", null);
__decorate([
    (0, common_1.Get)('results/:proposalId'),
    (0, roles_decorator_1.Roles)('user', 'admin', 'moderator'),
    __param(0, (0, common_1.Param)('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "getProposalResults", null);
__decorate([
    (0, common_1.Post)('proposals/:proposalId/close'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "closeProposal", null);
exports.GovernanceController = GovernanceController = __decorate([
    (0, common_1.Controller)('governance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [governance_service_1.GovernanceService])
], GovernanceController);
//# sourceMappingURL=governance.controller.js.map