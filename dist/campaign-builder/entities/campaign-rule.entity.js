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
exports.CampaignRule = exports.RuleType = void 0;
const typeorm_1 = require("typeorm");
const campaign_template_entity_1 = require("./campaign-template.entity");
var RuleType;
(function (RuleType) {
    RuleType["ELIGIBILITY"] = "eligibility";
    RuleType["COMPLETION"] = "completion";
    RuleType["REWARD"] = "reward";
    RuleType["CUSTOM"] = "custom";
})(RuleType || (exports.RuleType = RuleType = {}));
let CampaignRule = class CampaignRule {
    id;
    templateId;
    template;
    name;
    description;
    type;
    conditions;
    actions;
    isActive;
    metadata;
    createdAt;
};
exports.CampaignRule = CampaignRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampaignRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignRule.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_template_entity_1.CampaignTemplate, template => template.rules),
    (0, typeorm_1.JoinColumn)({ name: 'templateId' }),
    __metadata("design:type", campaign_template_entity_1.CampaignTemplate)
], CampaignRule.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CampaignRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RuleType,
        default: RuleType.ELIGIBILITY
    }),
    __metadata("design:type", String)
], CampaignRule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], CampaignRule.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], CampaignRule.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CampaignRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CampaignRule.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignRule.prototype, "createdAt", void 0);
exports.CampaignRule = CampaignRule = __decorate([
    (0, typeorm_1.Entity)('campaign_rules')
], CampaignRule);
//# sourceMappingURL=campaign-rule.entity.js.map