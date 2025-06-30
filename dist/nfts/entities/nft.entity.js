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
exports.NftSchema = exports.Nft = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_entity_1 = require("../../organizations/entities/organization.entity");
const user_entity_1 = require("../../users/entities/user.entity");
class Attribute {
    trait_type;
    value;
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Attribute.prototype, "trait_type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Attribute.prototype, "value", void 0);
class Metadata {
    name;
    description;
    image;
    attributes;
}
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Metadata.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Metadata.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Metadata.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Attribute] }),
    __metadata("design:type", Array)
], Metadata.prototype, "attributes", void 0);
let Nft = class Nft {
    tokenId;
    contractAddress;
    metadata;
    organization;
    owner;
};
exports.Nft = Nft;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Nft.prototype, "tokenId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Nft.prototype, "contractAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Metadata }),
    __metadata("design:type", Metadata)
], Nft.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    }),
    __metadata("design:type", organization_entity_1.Organization)
], Nft.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_entity_1.User)
], Nft.prototype, "owner", void 0);
exports.Nft = Nft = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Nft);
exports.NftSchema = mongoose_1.SchemaFactory.createForClass(Nft);
//# sourceMappingURL=nft.entity.js.map