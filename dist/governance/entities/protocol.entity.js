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
exports.Protocol = void 0;
const typeorm_1 = require("typeorm");
const proposal_entity_1 = require("./proposal.entity");
let Protocol = class Protocol {
    id;
    name;
    description;
    logoUrl;
    isActive;
    proposals;
    createdAt;
    updatedAt;
};
exports.Protocol = Protocol;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Protocol.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Protocol.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Protocol.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Protocol.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Protocol.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proposal_entity_1.Proposal, (proposal) => proposal.protocol),
    __metadata("design:type", Array)
], Protocol.prototype, "proposals", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Protocol.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Protocol.prototype, "updatedAt", void 0);
exports.Protocol = Protocol = __decorate([
    (0, typeorm_1.Entity)('protocols')
], Protocol);
//# sourceMappingURL=protocol.entity.js.map