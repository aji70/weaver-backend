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
exports.CampaignBuilderController = void 0;
const common_1 = require("@nestjs/common");
const campaign_builder_service_1 = require("./campaign-builder.service");
const create_template_dto_1 = require("./dto/create-template.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const campaign_template_entity_1 = require("./entities/campaign-template.entity");
let CampaignBuilderController = class CampaignBuilderController {
    campaignBuilderService;
    constructor(campaignBuilderService) {
        this.campaignBuilderService = campaignBuilderService;
    }
    async createTemplate(createTemplateDto) {
        return this.campaignBuilderService.createTemplate(createTemplateDto);
    }
    async findAll(status) {
        return this.campaignBuilderService.findAll(status);
    }
    async findOne(id) {
        return this.campaignBuilderService.findOne(id);
    }
    async updateStatus(id, status) {
        return this.campaignBuilderService.updateStatus(id, status);
    }
    async cloneTemplate(id) {
        return this.campaignBuilderService.cloneTemplate(id);
    }
};
exports.CampaignBuilderController = CampaignBuilderController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], CampaignBuilderController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'moderator', 'user'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignBuilderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'moderator', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignBuilderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CampaignBuilderController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/clone'),
    (0, roles_decorator_1.Roles)('admin', 'moderator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignBuilderController.prototype, "cloneTemplate", null);
exports.CampaignBuilderController = CampaignBuilderController = __decorate([
    (0, common_1.Controller)('campaigns/templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [campaign_builder_service_1.CampaignBuilderService])
], CampaignBuilderController);
//# sourceMappingURL=campaign-builder.controller.js.map