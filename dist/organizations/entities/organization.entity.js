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
exports.OrganizationSchema = exports.Organization = exports.OrganizationTier = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class SocialLinks {
    website;
    twitter;
    discord;
    telegram;
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialLinks.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialLinks.prototype, "twitter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialLinks.prototype, "discord", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialLinks.prototype, "telegram", void 0);
var OrganizationTier;
(function (OrganizationTier) {
    OrganizationTier["BRONZE"] = "BRONZE";
    OrganizationTier["SILVER"] = "SILVER";
    OrganizationTier["GOLD"] = "GOLD";
    OrganizationTier["PLATINUM"] = "PLATINUM";
})(OrganizationTier || (exports.OrganizationTier = OrganizationTier = {}));
let Organization = class Organization {
    name;
    description;
    tier;
    socialLinks;
    nftRewards;
};
exports.Organization = Organization;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Organization.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: OrganizationTier,
        default: OrganizationTier.BRONZE,
    }),
    __metadata("design:type", String)
], Organization.prototype, "tier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SocialLinks }),
    __metadata("design:type", SocialLinks)
], Organization.prototype, "socialLinks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Nft' }] }),
    __metadata("design:type", Array)
], Organization.prototype, "nftRewards", void 0);
exports.Organization = Organization = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Organization);
exports.OrganizationSchema = mongoose_1.SchemaFactory.createForClass(Organization);
//# sourceMappingURL=organization.entity.js.map