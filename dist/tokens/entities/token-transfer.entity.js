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
exports.TokenTransferSchema = exports.TokenTransfer = exports.TokenType = exports.TransactionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../users/entities/user.entity");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["PROCESSING"] = "PROCESSING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TokenType;
(function (TokenType) {
    TokenType["ETH"] = "ETH";
    TokenType["ERC20"] = "ERC20";
    TokenType["CUSTOM"] = "CUSTOM";
})(TokenType || (exports.TokenType = TokenType = {}));
let TokenTransfer = class TokenTransfer {
    sender;
    recipient;
    amount;
    tokenAddress;
    tokenType;
    starknetTxHash;
    status;
    metadata;
    messageId;
};
exports.TokenTransfer = TokenTransfer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_entity_1.User)
], TokenTransfer.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_entity_1.User)
], TokenTransfer.prototype, "recipient", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "tokenAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TokenType,
        required: true,
    }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "tokenType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "starknetTxHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], TokenTransfer.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Message' }),
    __metadata("design:type", String)
], TokenTransfer.prototype, "messageId", void 0);
exports.TokenTransfer = TokenTransfer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TokenTransfer);
exports.TokenTransferSchema = mongoose_1.SchemaFactory.createForClass(TokenTransfer);
//# sourceMappingURL=token-transfer.entity.js.map