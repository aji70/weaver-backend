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
exports.Vote = exports.VoteType = void 0;
const typeorm_1 = require("typeorm");
const proposal_entity_1 = require("./proposal.entity");
var VoteType;
(function (VoteType) {
    VoteType["FOR"] = "for";
    VoteType["AGAINST"] = "against";
    VoteType["ABSTAIN"] = "abstain";
})(VoteType || (exports.VoteType = VoteType = {}));
let Vote = class Vote {
    id;
    voterId;
    voteType;
    reputationScore;
    weightedVote;
    proposalId;
    proposal;
    signature;
    createdAt;
    weight;
    choice;
    voter;
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vote.prototype, "voterId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VoteType,
    }),
    __metadata("design:type", String)
], Vote.prototype, "voteType", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Vote.prototype, "reputationScore", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Vote.prototype, "weightedVote", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vote.prototype, "proposalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proposal_entity_1.Proposal, (proposal) => proposal.votes),
    (0, typeorm_1.JoinColumn)({ name: 'proposalId' }),
    __metadata("design:type", proposal_entity_1.Proposal)
], Vote.prototype, "proposal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Vote.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vote.prototype, "createdAt", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)('votes')
], Vote);
//# sourceMappingURL=vote.entity.js.map