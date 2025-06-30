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
exports.CampaignMilestone = exports.MilestoneType = void 0;
const typeorm_1 = require("typeorm");
const campaign_template_entity_1 = require("./campaign-template.entity");
var MilestoneType;
(function (MilestoneType) {
    MilestoneType["TASK"] = "task";
    MilestoneType["TIME"] = "time";
    MilestoneType["ACHIEVEMENT"] = "achievement";
    MilestoneType["CUSTOM"] = "custom";
})(MilestoneType || (exports.MilestoneType = MilestoneType = {}));
let CampaignMilestone = class CampaignMilestone {
    id;
    templateId;
    template;
    title;
    description;
    type;
    requirements;
    rewards;
    order;
    metadata;
    createdAt;
};
exports.CampaignMilestone = CampaignMilestone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampaignMilestone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignMilestone.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_template_entity_1.CampaignTemplate, template => template.milestones),
    (0, typeorm_1.JoinColumn)({ name: 'templateId' }),
    __metadata("design:type", campaign_template_entity_1.CampaignTemplate)
], CampaignMilestone.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CampaignMilestone.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CampaignMilestone.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MilestoneType,
        default: MilestoneType.TASK
    }),
    __metadata("design:type", String)
], CampaignMilestone.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], CampaignMilestone.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], CampaignMilestone.prototype, "rewards", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CampaignMilestone.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], CampaignMilestone.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignMilestone.prototype, "createdAt", void 0);
exports.CampaignMilestone = CampaignMilestone = __decorate([
    (0, typeorm_1.Entity)('campaign_milestones')
], CampaignMilestone);
//# sourceMappingURL=campaign-milestone.entity.js.map