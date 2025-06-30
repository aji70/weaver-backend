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
exports.Recommendation = exports.RecommendationPriority = exports.RecommendationType = void 0;
const typeorm_1 = require("typeorm");
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["CAMPAIGN_OPTIMIZATION"] = "campaign_optimization";
    RecommendationType["USER_RETENTION"] = "user_retention";
    RecommendationType["ANOMALY_DETECTION"] = "anomaly_detection";
})(RecommendationType || (exports.RecommendationType = RecommendationType = {}));
var RecommendationPriority;
(function (RecommendationPriority) {
    RecommendationPriority["LOW"] = "low";
    RecommendationPriority["MEDIUM"] = "medium";
    RecommendationPriority["HIGH"] = "high";
})(RecommendationPriority || (exports.RecommendationPriority = RecommendationPriority = {}));
let Recommendation = class Recommendation {
    id;
    type;
    priority;
    targetId;
    description;
    data;
    metrics;
    isRead;
    isApplied;
    createdAt;
    updatedAt;
};
exports.Recommendation = Recommendation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Recommendation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RecommendationType
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RecommendationPriority,
        default: RecommendationPriority.MEDIUM
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Recommendation.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Recommendation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Recommendation.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Recommendation.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Recommendation.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Recommendation.prototype, "isApplied", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Recommendation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Recommendation.prototype, "updatedAt", void 0);
exports.Recommendation = Recommendation = __decorate([
    (0, typeorm_1.Entity)('recommendations')
], Recommendation);
//# sourceMappingURL=recommendation.entity.js.map