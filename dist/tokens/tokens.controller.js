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
exports.TokensController = void 0;
const common_1 = require("@nestjs/common");
const tokens_service_1 = require("./tokens.service");
const create_token_transfer_dto_1 = require("./dto/create-token-transfer.dto");
let TokensController = class TokensController {
    tokensService;
    constructor(tokensService) {
        this.tokensService = tokensService;
    }
    async create(userId, createTokenTransferDto) {
        return this.tokensService.create(userId, createTokenTransferDto);
    }
    findAll(userId) {
        return this.tokensService.findAll(userId);
    }
    findOne(id, userId) {
        return this.tokensService.findOne(id, userId);
    }
    async checkStatus(id) {
        const transfer = await this.tokensService.findOne(id, null);
        const status = await this.tokensService.checkTransactionStatus(transfer.starknetTxHash);
        await this.tokensService.updateStatus(id, status);
        return { status };
    }
    async validateBalance(userId, tokenAddress, amount) {
        const isValid = await this.tokensService.validateTokenBalance(userId, tokenAddress, amount);
        return { isValid };
    }
};
exports.TokensController = TokensController;
__decorate([
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_token_transfer_dto_1.CreateTokenTransferDto]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('transfers'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('transfers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('transfers/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "checkStatus", null);
__decorate([
    (0, common_1.Get)('validate-balance'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('tokenAddress')),
    __param(2, (0, common_1.Query)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "validateBalance", null);
exports.TokensController = TokensController = __decorate([
    (0, common_1.Controller)('tokens'),
    __metadata("design:paramtypes", [tokens_service_1.TokensService])
], TokensController);
//# sourceMappingURL=tokens.controller.js.map