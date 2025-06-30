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
exports.CampaignMetricResponseDto = exports.CreateCampaignMetricDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCampaignMetricDto {
    campaignId;
    type;
    userId;
    metadata;
    timestamp;
}
exports.CreateCampaignMetricDto = CreateCampaignMetricDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignMetricDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['impression', 'click', 'task_start', 'task_complete']),
    __metadata("design:type", String)
], CreateCampaignMetricDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignMetricDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCampaignMetricDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateCampaignMetricDto.prototype, "timestamp", void 0);
class CampaignMetricResponseDto {
    campaignId;
    type;
    userId;
    metadata;
    timestamp;
}
exports.CampaignMetricResponseDto = CampaignMetricResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CampaignMetricResponseDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['impression', 'click', 'task_start', 'task_complete']),
    __metadata("design:type", String)
], CampaignMetricResponseDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CampaignMetricResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CampaignMetricResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CampaignMetricResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=campaign-metric.dto.js.map