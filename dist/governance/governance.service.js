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
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proposal_entity_1 = require("./entities/proposal.entity");
const vote_entity_1 = require("./entities/vote.entity");
const reputation_service_1 = require("../reputation/reputation.service");
let GovernanceService = class GovernanceService {
    proposalRepository;
    voteRepository;
    reputationService;
    constructor(proposalRepository, voteRepository, reputationService) {
        this.proposalRepository = proposalRepository;
        this.voteRepository = voteRepository;
        this.reputationService = reputationService;
    }
    async createProposal(creatorId, createProposalDto) {
        const proposal = this.proposalRepository.create({
            ...createProposalDto,
            creatorId,
        });
        return this.proposalRepository.save(proposal);
    }
    async submitVote(userId, createVoteDto) {
        const proposal = await this.proposalRepository.findOne({
            where: { id: createVoteDto.proposalId },
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        if (proposal.status !== proposal_entity_1.ProposalStatus.ACTIVE) {
            throw new common_1.BadRequestException('Proposal is not active');
        }
        const existingVote = await this.voteRepository.findOne({
            where: {
                proposalId: createVoteDto.proposalId,
                voterId: userId,
            },
        });
        if (existingVote) {
            throw new common_1.BadRequestException('User has already voted on this proposal');
        }
        const reputationScore = await this.reputationService.getUserReputationScore(userId);
        const weightedVote = this.calculateWeightedVote(createVoteDto.voteType, reputationScore);
        const vote = this.voteRepository.create({
            ...createVoteDto,
            voterId: userId,
            reputationScore,
            weightedVote,
        });
        return this.voteRepository.save(vote);
    }
    async getProposalResults(proposalId) {
        const proposal = await this.proposalRepository.findOne({
            where: { id: proposalId },
            relations: ['votes'],
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        const results = {
            totalVotes: proposal.votes.length,
            weightedResults: {
                [vote_entity_1.VoteType.FOR]: 0,
                [vote_entity_1.VoteType.AGAINST]: 0,
                [vote_entity_1.VoteType.ABSTAIN]: 0,
            },
            voterBreakdown: {
                [vote_entity_1.VoteType.FOR]: [],
                [vote_entity_1.VoteType.AGAINST]: [],
                [vote_entity_1.VoteType.ABSTAIN]: [],
            },
        };
        proposal.votes.forEach((vote) => {
            results.weightedResults[vote.voteType] += vote.weightedVote;
            results.voterBreakdown[vote.voteType].push({
                voterId: vote.voterId,
                reputationScore: vote.reputationScore,
                weightedVote: vote.weightedVote,
            });
        });
        return results;
    }
    calculateWeightedVote(voteType, reputationScore) {
        const baseWeight = voteType === vote_entity_1.VoteType.ABSTAIN ? 0.5 : 1;
        return baseWeight * (reputationScore / 100);
    }
    async closeProposal(proposalId) {
        const proposal = await this.proposalRepository.findOne({
            where: { id: proposalId },
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        proposal.status = proposal_entity_1.ProposalStatus.CLOSED;
        return this.proposalRepository.save(proposal);
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proposal_entity_1.Proposal)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        reputation_service_1.ReputationService])
], GovernanceService);
//# sourceMappingURL=governance.service.js.map