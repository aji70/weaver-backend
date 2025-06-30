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
var RewardProcessor_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
const reward_entity_1 = require("../entities/reward.entity");
const reward_claim_entity_1 = require("../entities/reward-claim.entity");
let RewardProcessor = RewardProcessor_1 = class RewardProcessor {
    rewardRepository;
    claimRepository;
    configService;
    logger = new common_1.Logger(RewardProcessor_1.name);
    provider;
    wallet;
    constructor(rewardRepository, claimRepository, configService) {
        this.rewardRepository = rewardRepository;
        this.claimRepository = claimRepository;
        this.configService = configService;
        this.provider = new ethers_1.ethers.JsonRpcProvider(this.configService.get('ETHEREUM_RPC_URL'));
        this.wallet = new ethers_1.ethers.Wallet(this.configService.get('REWARD_WALLET_PRIVATE_KEY'), this.provider);
    }
    async handleClaim(job) {
        const { claimId } = job.data;
        const claim = await this.claimRepository.findOne({
            where: { id: claimId },
            relations: ['reward'],
        });
        if (!claim || !claim.reward) {
            throw new Error('Claim or reward not found');
        }
        try {
            claim.status = reward_claim_entity_1.ClaimStatus.PROCESSING;
            claim.processedAt = new Date();
            await this.claimRepository.save(claim);
            const txHash = await this.processTransfer(claim);
            claim.status = reward_claim_entity_1.ClaimStatus.COMPLETED;
            claim.transactionHash = txHash;
            claim.completedAt = new Date();
            await this.claimRepository.save(claim);
            claim.reward.status = reward_entity_1.RewardStatus.CLAIMED;
            claim.reward.transactionHash = txHash;
            await this.rewardRepository.save(claim.reward);
            this.logger.log(`Successfully processed claim ${claimId} with tx ${txHash}`);
        }
        catch (error) {
            this.logger.error(`Failed to process claim ${claimId}: ${error.message}`);
            claim.status = reward_claim_entity_1.ClaimStatus.FAILED;
            claim.error = {
                message: error.message,
                stack: error.stack,
            };
            await this.claimRepository.save(claim);
            throw error;
        }
    }
    async processTransfer(claim) {
        const { reward } = claim;
        const amount = ethers_1.ethers.parseEther(reward.amount.toString());
        if (reward.tokenType === reward_entity_1.TokenType.NATIVE) {
            const tx = await this.wallet.sendTransaction({
                to: claim.walletAddress,
                value: amount,
            });
            return tx.hash;
        }
        else {
            const tokenContract = new ethers_1.ethers.Contract(reward.tokenAddress, [
                'function transfer(address to, uint256 amount) returns (bool)',
            ], this.wallet);
            const tx = await tokenContract.transfer(claim.walletAddress, amount);
            return tx.hash;
        }
    }
    async handleBatchClaims(job) {
        const { claimIds } = job.data;
        const batchSize = 10;
        for (let i = 0; i < claimIds.length; i += batchSize) {
            const batch = claimIds.slice(i, i + batchSize);
            await Promise.all(batch.map(claimId => this.handleClaim({ data: { claimId } })));
        }
    }
};
exports.RewardProcessor = RewardProcessor;
__decorate([
    (0, bull_1.Process)('process-claim'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], RewardProcessor.prototype, "handleClaim", null);
__decorate([
    (0, bull_1.Process)('batch-process-claims'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], RewardProcessor.prototype, "handleBatchClaims", null);
exports.RewardProcessor = RewardProcessor = RewardProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('rewards'),
    __param(0, (0, typeorm_1.InjectRepository)(reward_entity_1.Reward)),
    __param(1, (0, typeorm_1.InjectRepository)(reward_claim_entity_1.RewardClaim)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], RewardProcessor);
//# sourceMappingURL=reward.processor.js.map