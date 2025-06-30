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
exports.ReputationController = void 0;
const common_1 = require("@nestjs/common");
const reputation_service_1 = require("./reputation.service");
const create_reputation_dto_1 = require("./dto/create-reputation.dto");
const update_reputation_dto_1 = require("./dto/update-reputation.dto");
let ReputationController = class ReputationController {
    reputationService;
    constructor(reputationService) {
        this.reputationService = reputationService;
    }
    create(createReputationDto) {
        return this.reputationService.create(createReputationDto);
    }
    findAll() {
        return this.reputationService.findAll();
    }
    findOne(id) {
        return this.reputationService.findOne(+id);
    }
    update(id, updateReputationDto) {
        return this.reputationService.update(+id, updateReputationDto);
    }
    remove(id) {
        return this.reputationService.remove(+id);
    }
};
exports.ReputationController = ReputationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reputation_dto_1.CreateReputationDto]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reputation_dto_1.UpdateReputationDto]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReputationController.prototype, "remove", null);
exports.ReputationController = ReputationController = __decorate([
    (0, common_1.Controller)('reputation'),
    __metadata("design:paramtypes", [reputation_service_1.ReputationService])
], ReputationController);
//# sourceMappingURL=reputation.controller.js.map