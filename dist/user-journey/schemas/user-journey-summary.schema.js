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
exports.UserJourneySummarySchema = exports.UserJourneySummary = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UserJourneySummary = class UserJourneySummary {
    userId;
    date;
    sessionCount;
    totalActions;
    actionTypeCounts;
    actionNameCounts;
    actionDurations;
    successRates;
    commonFlows;
    dropOffPoints;
    averageSessionDuration;
    completionRate;
    metadata;
};
exports.UserJourneySummary = UserJourneySummary;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserJourneySummary.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], UserJourneySummary.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserJourneySummary.prototype, "sessionCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserJourneySummary.prototype, "totalActions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "actionTypeCounts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "actionNameCounts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "actionDurations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "successRates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: [String] }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "commonFlows", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: Number }),
    __metadata("design:type", Map)
], UserJourneySummary.prototype, "dropOffPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], UserJourneySummary.prototype, "averageSessionDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], UserJourneySummary.prototype, "completionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Object)
], UserJourneySummary.prototype, "metadata", void 0);
exports.UserJourneySummary = UserJourneySummary = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserJourneySummary);
exports.UserJourneySummarySchema = mongoose_1.SchemaFactory.createForClass(UserJourneySummary);
exports.UserJourneySummarySchema.index({ userId: 1, date: 1 }, { unique: true });
//# sourceMappingURL=user-journey-summary.schema.js.map