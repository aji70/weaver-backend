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
exports.CampaignTemplate = exports.TemplateStatus = void 0;
const typeorm_1 = require("typeorm");
const campaign_milestone_entity_1 = require("./campaign-milestone.entity");
const campaign_rule_entity_1 = require("./campaign-rule.entity");
var TemplateStatus;
(function (TemplateStatus) {
    TemplateStatus["DRAFT"] = "draft";
    TemplateStatus["ACTIVE"] = "active";
    TemplateStatus["ARCHIVED"] = "archived";
})(TemplateStatus || (exports.TemplateStatus = TemplateStatus = {}));
let CampaignTemplate = class CampaignTemplate {
    id;
    title;
    description;
    status;
    rewardStructure;
    targetingRules;
    milestones;
    rules;
    metadata;
    usageCount;
    createdAt;
    updatedAt;
};
exports.CampaignTemplate = CampaignTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampaignTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignTemplate.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CampaignTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TemplateStatus,
        default: TemplateStatus.DRAFT
    }),
    __metadata("design:type", String)
], CampaignTemplate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], CampaignTemplate.prototype, "rewardStructure", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CampaignTemplate.prototype, "targetingRules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_milestone_entity_1.CampaignMilestone, milestone => milestone.template),
    __metadata("design:type", Array)
], CampaignTemplate.prototype, "milestones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_rule_entity_1.CampaignRule, rule => rule.template),
    __metadata("design:type", Array)
], CampaignTemplate.prototype, "rules", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CampaignTemplate.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignTemplate.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CampaignTemplate.prototype, "updatedAt", void 0);
exports.CampaignTemplate = CampaignTemplate = __decorate([
    (0, typeorm_1.Entity)('campaign_templates')
], CampaignTemplate);
//# sourceMappingURL=campaign-template.entity.js.map