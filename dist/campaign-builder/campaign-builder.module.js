"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignBuilderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const campaign_builder_controller_1 = require("./campaign-builder.controller");
const campaign_builder_service_1 = require("./campaign-builder.service");
const campaign_template_entity_1 = require("./entities/campaign-template.entity");
const campaign_milestone_entity_1 = require("./entities/campaign-milestone.entity");
const campaign_rule_entity_1 = require("./entities/campaign-rule.entity");
let CampaignBuilderModule = class CampaignBuilderModule {
};
exports.CampaignBuilderModule = CampaignBuilderModule;
exports.CampaignBuilderModule = CampaignBuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                campaign_template_entity_1.CampaignTemplate,
                campaign_milestone_entity_1.CampaignMilestone,
                campaign_rule_entity_1.CampaignRule,
            ]),
        ],
        controllers: [campaign_builder_controller_1.CampaignBuilderController],
        providers: [campaign_builder_service_1.CampaignBuilderService],
        exports: [campaign_builder_service_1.CampaignBuilderService],
    })
], CampaignBuilderModule);
//# sourceMappingURL=campaign-builder.module.js.map