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
exports.Proposal = exports.ProposalStatus = void 0;
const typeorm_1 = require("typeorm");
const vote_entity_1 = require("./vote.entity");
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus["ACTIVE"] = "active";
    ProposalStatus["CLOSED"] = "closed";
    ProposalStatus["CANCELLED"] = "cancelled";
    ProposalStatus["EXECUTED"] = "EXECUTED";
})(ProposalStatus || (exports.ProposalStatus = ProposalStatus = {}));
let Proposal = class Proposal {
    id;
    title;
    description;
    status;
    creatorId;
    startDate;
    endDate;
    votes;
    createdAt;
    updatedAt;
    finalOutcome;
};
exports.Proposal = Proposal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Proposal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Proposal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProposalStatus,
        default: ProposalStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Proposal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposal.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Proposal.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Proposal.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.proposal),
    __metadata("design:type", Array)
], Proposal.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Proposal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Proposal.prototype, "updatedAt", void 0);
exports.Proposal = Proposal = __decorate([
    (0, typeorm_1.Entity)('proposals')
], Proposal);
//# sourceMappingURL=proposal.entity.js.map