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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardClaim = exports.ClaimStatus = void 0;
const typeorm_1 = require("typeorm");
const reward_entity_1 = require("./reward.entity");
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["PENDING"] = "pending";
    ClaimStatus["PROCESSING"] = "processing";
    ClaimStatus["COMPLETED"] = "completed";
    ClaimStatus["FAILED"] = "failed";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
let RewardClaim = class RewardClaim {
    id;
    rewardId;
    reward;
    userId;
    walletAddress;
    status;
    transactionHash;
    error;
    metadata;
    createdAt;
    processedAt;
    completedAt;
};
exports.RewardClaim = RewardClaim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RewardClaim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RewardClaim.prototype, "rewardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reward_entity_1.Reward, reward => reward.claims),
    (0, typeorm_1.JoinColumn)({ name: 'rewardId' }),
    __metadata("design:type", reward_entity_1.Reward)
], RewardClaim.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RewardClaim.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RewardClaim.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ClaimStatus,
        default: ClaimStatus.PENDING
    }),
    __metadata("design:type", String)
], RewardClaim.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RewardClaim.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], RewardClaim.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], RewardClaim.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RewardClaim.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], RewardClaim.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], RewardClaim.prototype, "completedAt", void 0);
exports.RewardClaim = RewardClaim = __decorate([
    (0, typeorm_1.Entity)('reward_claims')
], RewardClaim);
//# sourceMappingURL=reward-claim.entity.js.map