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
exports.Reward = exports.RewardStatus = exports.TokenType = void 0;
const typeorm_1 = require("typeorm");
const reward_claim_entity_1 = require("./reward-claim.entity");
var TokenType;
(function (TokenType) {
    TokenType["ERC20"] = "erc20";
    TokenType["NATIVE"] = "native";
})(TokenType || (exports.TokenType = TokenType = {}));
var RewardStatus;
(function (RewardStatus) {
    RewardStatus["PENDING"] = "pending";
    RewardStatus["ASSIGNED"] = "assigned";
    RewardStatus["CLAIMED"] = "claimed";
    RewardStatus["CANCELLED"] = "cancelled";
})(RewardStatus || (exports.RewardStatus = RewardStatus = {}));
let Reward = class Reward {
    id;
    campaignId;
    userId;
    amount;
    tokenType;
    tokenAddress;
    status;
    walletAddress;
    transactionHash;
    metadata;
    claims;
    createdAt;
    updatedAt;
};
exports.Reward = Reward;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reward.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reward.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 36, scale: 18 }),
    __metadata("design:type", String)
], Reward.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TokenType,
        default: TokenType.ERC20
    }),
    __metadata("design:type", String)
], Reward.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reward.prototype, "tokenAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RewardStatus,
        default: RewardStatus.PENDING
    }),
    __metadata("design:type", String)
], Reward.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reward.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reward.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Reward.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reward_claim_entity_1.RewardClaim, claim => claim.reward),
    __metadata("design:type", Array)
], Reward.prototype, "claims", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reward.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reward.prototype, "updatedAt", void 0);
exports.Reward = Reward = __decorate([
    (0, typeorm_1.Entity)('rewards')
], Reward);
//# sourceMappingURL=reward.entity.js.map