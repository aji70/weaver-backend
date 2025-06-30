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
exports.NftsController = void 0;
const common_1 = require("@nestjs/common");
const nfts_service_1 = require("./nfts.service");
const create_nft_dto_1 = require("./dto/create-nft.dto");
const update_nft_dto_1 = require("./dto/update-nft.dto");
let NftsController = class NftsController {
    nftsService;
    constructor(nftsService) {
        this.nftsService = nftsService;
    }
    create(createNftDto) {
        return this.nftsService.create(createNftDto);
    }
    findAll() {
        return this.nftsService.findAll();
    }
    findOne(id) {
        return this.nftsService.findOne(+id);
    }
    update(id, updateNftDto) {
        return this.nftsService.update(+id, updateNftDto);
    }
    remove(id) {
        return this.nftsService.remove(+id);
    }
};
exports.NftsController = NftsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nft_dto_1.CreateNftDto]),
    __metadata("design:returntype", void 0)
], NftsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_nft_dto_1.UpdateNftDto]),
    __metadata("design:returntype", void 0)
], NftsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NftsController.prototype, "remove", null);
exports.NftsController = NftsController = __decorate([
    (0, common_1.Controller)('nfts'),
    __metadata("design:paramtypes", [nfts_service_1.NftsService])
], NftsController);
//# sourceMappingURL=nfts.controller.js.map