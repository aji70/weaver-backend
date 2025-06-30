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
exports.GovernanceTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const vote_entity_1 = require("../governance/entities/vote.entity");
const proposal_entity_1 = require("../governance/entities/proposal.entity");
const protocol_entity_1 = require("../governance/entities/protocol.entity");
const proposal_entity_2 = require("../governance/entities/proposal.entity");
let GovernanceTrackingService = class GovernanceTrackingService {
    userRepo;
    voteRepo;
    proposalRepo;
    protocolRepo;
    constructor(userRepo, voteRepo, proposalRepo, protocolRepo) {
        this.userRepo = userRepo;
        this.voteRepo = voteRepo;
        this.proposalRepo = proposalRepo;
        this.protocolRepo = protocolRepo;
    }
    async getUserGovernanceStats(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const votes = await this.voteRepo.find({
            where: { voter: { id: userId } },
            relations: ['proposal'],
        });
        const totalWeight = votes.reduce((sum, vote) => sum + vote.weight, 0);
        const alignedVotes = votes.filter((vote) => vote.proposal?.finalOutcome &&
            vote.choice === vote.proposal.finalOutcome);
        const influenceRate = votes.length > 0 ? alignedVotes.length / votes.length : 0;
        return {
            reputation: user.reputationScore,
            totalVotes: votes.length,
            totalWeight,
            influenceRate: parseFloat(influenceRate.toFixed(2)),
            proposalsParticipated: votes.map((vote) => ({
                proposalId: vote.proposal.id,
                title: vote.proposal.title,
                status: vote.proposal.status,
                vote: vote.choice,
                outcome: vote.proposal.finalOutcome ?? 'N/A',
            })),
        };
    }
    async getProtocolAnalytics(protocolId) {
        const protocol = await this.protocolRepo.findOne({
            where: { id: protocolId },
        });
        if (!protocol)
            throw new common_1.NotFoundException('Protocol not found');
        const proposals = await this.proposalRepo.find({
            where: { id: protocolId.toString() },
            relations: ['votes', 'votes.voter'],
        });
        const total = proposals.length;
        const passed = proposals.filter((p) => p.status === proposal_entity_2.ProposalStatus.EXECUTED).length;
        const allVotes = proposals.flatMap((p) => p.votes);
        const uniqueVoters = new Set(allVotes
            .map((v) => {
            const voter = v.voter;
            return voter && typeof voter.id === 'number' ? voter.id : undefined;
        })
            .filter((id) => typeof id === 'number')).size;
        const avgTurnout = total > 0 ? allVotes.length / total : 0;
        return {
            protocolId,
            protocolName: protocol.name,
            proposalCount: total,
            proposalPassed: passed,
            passRate: total > 0 ? parseFloat((passed / total).toFixed(2)) : 0,
            voterCount: uniqueVoters,
            avgTurnout: parseFloat(avgTurnout.toFixed(2)),
        };
    }
};
exports.GovernanceTrackingService = GovernanceTrackingService;
exports.GovernanceTrackingService = GovernanceTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __param(2, (0, typeorm_1.InjectRepository)(proposal_entity_1.Proposal)),
    __param(3, (0, typeorm_1.InjectRepository)(protocol_entity_1.Protocol)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GovernanceTrackingService);
//# sourceMappingURL=governance-tracking.service.js.map