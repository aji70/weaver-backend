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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const token_transfer_entity_1 = require("./entities/token-transfer.entity");
let TokensService = class TokensService {
    tokenTransferModel;
    constructor(tokenTransferModel) {
        this.tokenTransferModel = tokenTransferModel;
    }
    async create(senderId, createTokenTransferDto) {
        const starknetTxHash = await this.initiateStarkNetTransfer(senderId, createTokenTransferDto);
        const tokenTransfer = new this.tokenTransferModel({
            sender: senderId,
            ...createTokenTransferDto,
            starknetTxHash,
            status: token_transfer_entity_1.TransactionStatus.PENDING,
        });
        return tokenTransfer.save();
    }
    async findAll(userId) {
        return this.tokenTransferModel
            .find({
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'username address')
            .populate('recipient', 'username address')
            .exec();
    }
    async findOne(id, userId) {
        const transfer = await this.tokenTransferModel
            .findOne({
            _id: id,
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .populate('sender', 'username address')
            .populate('recipient', 'username address')
            .exec();
        if (!transfer) {
            throw new common_1.NotFoundException('Transfer not found or unauthorized');
        }
        return transfer;
    }
    async updateStatus(id, status) {
        const transfer = await this.tokenTransferModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!transfer) {
            throw new common_1.NotFoundException('Transfer not found');
        }
        return transfer;
    }
    async initiateStarkNetTransfer(senderId, createTokenTransferDto) {
        return `0x${Array(64)
            .fill('0')
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('')}`;
    }
    async checkTransactionStatus(txHash) {
        const statuses = Object.values(token_transfer_entity_1.TransactionStatus);
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
    async validateTokenBalance(userId, tokenAddress, amount) {
        return true;
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(token_transfer_entity_1.TokenTransfer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TokensService);
//# sourceMappingURL=tokens.service.js.map