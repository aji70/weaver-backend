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
exports.CampaignSummarySchema = exports.CampaignSummary = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let CampaignSummary = class CampaignSummary {
    campaignId;
    date;
    impressions;
    clicks;
    taskStarts;
    taskCompletions;
    cost;
    revenue;
    ctr;
    conversionRate;
    roi;
    cpa;
};
exports.CampaignSummary = CampaignSummary;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CampaignSummary.prototype, "campaignId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], CampaignSummary.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "impressions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "clicks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "taskStarts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "taskCompletions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "cost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "ctr", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "conversionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "roi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CampaignSummary.prototype, "cpa", void 0);
exports.CampaignSummary = CampaignSummary = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CampaignSummary);
exports.CampaignSummarySchema = mongoose_1.SchemaFactory.createForClass(CampaignSummary);
exports.CampaignSummarySchema.index({ campaignId: 1, date: 1 }, { unique: true });
//# sourceMappingURL=campaign-summary.schema.js.map