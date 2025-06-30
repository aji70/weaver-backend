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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardDistributionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const reward_entity_1 = require("./entities/reward.entity");
const reward_claim_entity_1 = require("./entities/reward-claim.entity");
let RewardDistributionService = class RewardDistributionService {
    rewardRepository;
    claimRepository;
    rewardsQueue;
    constructor(rewardRepository, claimRepository, rewardsQueue) {
        this.rewardRepository = rewardRepository;
        this.claimRepository = claimRepository;
        this.rewardsQueue = rewardsQueue;
    }
    async assignReward(assignRewardDto) {
        const reward = this.rewardRepository.create({
            ...assignRewardDto,
            status: reward_entity_1.RewardStatus.ASSIGNED,
        });
        return this.rewardRepository.save(reward);
    }
    async claimReward(userId, claimRewardDto) {
        const reward = await this.rewardRepository.findOne({
            where: { id: claimRewardDto.rewardId },
        });
        if (!reward) {
            throw new common_1.NotFoundException('Reward not found');
        }
        if (reward.userId !== userId) {
            throw new common_1.BadRequestException('User is not authorized to claim this reward');
        }
        if (reward.status !== reward_entity_1.RewardStatus.ASSIGNED) {
            throw new common_1.BadRequestException('Reward is not available for claiming');
        }
        const existingClaim = await this.claimRepository.findOne({
            where: {
                rewardId: reward.id,
                status: In([reward_claim_entity_1.ClaimStatus.PENDING, reward_claim_entity_1.ClaimStatus.PROCESSING]),
            },
        });
        if (existingClaim) {
            throw new common_1.BadRequestException('Reward is already being claimed');
        }
        const claim = this.claimRepository.create({
            rewardId: reward.id,
            userId,
            walletAddress: claimRewardDto.walletAddress,
            status: reward_claim_entity_1.ClaimStatus.PENDING,
            metadata: claimRewardDto.metadata,
        });
        const savedClaim = await this.claimRepository.save(claim);
        await this.rewardsQueue.add('process-claim', {
            claimId: savedClaim.id,
        });
        return savedClaim;
    }
    async getUserRewardHistory(userId, status) {
        const query = this.rewardRepository.createQueryBuilder('reward')
            .where('reward.userId = :userId', { userId });
        if (status) {
            query.andWhere('reward.status = :status', { status });
        }
        return query
            .orderBy('reward.createdAt', 'DESC')
            .getMany();
    }
    async getRewardClaims(rewardId, status) {
        const query = this.claimRepository.createQueryBuilder('claim')
            .where('claim.rewardId = :rewardId', { rewardId });
        if (status) {
            query.andWhere('claim.status = :status', { status });
        }
        return query
            .orderBy('claim.createdAt', 'DESC')
            .getMany();
    }
    async batchProcessClaims(claimIds) {
        await this.rewardsQueue.add('batch-process-claims', { claimIds });
    }
};
exports.RewardDistributionService = RewardDistributionService;
exports.RewardDistributionService = RewardDistributionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reward_entity_1.Reward)),
    __param(1, (0, typeorm_1.InjectRepository)(reward_claim_entity_1.RewardClaim)),
    __param(2, (0, bull_1.InjectQueue)('rewards')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object])
], RewardDistributionService);
//# sourceMappingURL=reward-distribution.service.js.map