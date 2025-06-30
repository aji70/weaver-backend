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
exports.CreateTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const campaign_template_entity_1 = require("../entities/campaign-template.entity");
const campaign_milestone_entity_1 = require("../entities/campaign-milestone.entity");
const campaign_rule_entity_1 = require("../entities/campaign-rule.entity");
class RewardStructureDto {
    type;
    amount;
    tokenAddress;
    distributionRules;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RewardStructureDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RewardStructureDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RewardStructureDto.prototype, "tokenAddress", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RewardStructureDto.prototype, "distributionRules", void 0);
class TargetingRulesDto {
    userTypes;
    minReputation;
    requiredNfts;
    customConditions;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TargetingRulesDto.prototype, "userTypes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TargetingRulesDto.prototype, "minReputation", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], TargetingRulesDto.prototype, "requiredNfts", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TargetingRulesDto.prototype, "customConditions", void 0);
class MilestoneDto {
    title;
    description;
    type;
    requirements;
    rewards;
    order;
    metadata;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MilestoneDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MilestoneDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(campaign_milestone_entity_1.MilestoneType),
    __metadata("design:type", String)
], MilestoneDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MilestoneDto.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MilestoneDto.prototype, "rewards", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MilestoneDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MilestoneDto.prototype, "metadata", void 0);
class RuleDto {
    name;
    description;
    type;
    conditions;
    actions;
    metadata;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RuleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(campaign_rule_entity_1.RuleType),
    __metadata("design:type", String)
], RuleDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RuleDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RuleDto.prototype, "actions", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RuleDto.prototype, "metadata", void 0);
class CreateTemplateDto {
    title;
    description;
    status;
    rewardStructure;
    targetingRules;
    milestones;
    rules;
    metadata;
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(campaign_template_entity_1.TemplateStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RewardStructureDto),
    __metadata("design:type", RewardStructureDto)
], CreateTemplateDto.prototype, "rewardStructure", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TargetingRulesDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TargetingRulesDto)
], CreateTemplateDto.prototype, "targetingRules", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MilestoneDto),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "milestones", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RuleDto),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "rules", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTemplateDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-template.dto.js.map