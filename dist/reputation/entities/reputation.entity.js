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
exports.ReputationSchema = exports.Reputation = exports.VerificationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../users/entities/user.entity");
const organization_entity_1 = require("../../organizations/entities/organization.entity");
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "PENDING";
    VerificationStatus["VERIFIED"] = "VERIFIED";
    VerificationStatus["REJECTED"] = "REJECTED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
let Reputation = class Reputation {
    user;
    action;
    points;
    proof;
    verificationStatus;
    verifiedAt;
    verifiedBy;
    organization;
};
exports.Reputation = Reputation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_entity_1.User)
], Reputation.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reputation.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reputation.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reputation.prototype, "proof", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Reputation.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Reputation.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_entity_1.User)
], Reputation.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", organization_entity_1.Organization)
], Reputation.prototype, "organization", void 0);
exports.Reputation = Reputation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reputation);
exports.ReputationSchema = mongoose_1.SchemaFactory.createForClass(Reputation);
//# sourceMappingURL=reputation.entity.js.map