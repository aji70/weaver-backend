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
exports.ProtocolHealthMetric = void 0;
const typeorm_1 = require("typeorm");
let ProtocolHealthMetric = class ProtocolHealthMetric {
    id;
    protocolId;
    tvl;
    dailyTransactionVolume;
    weeklyTransactionVolume;
    walletGrowthRate;
    healthScore;
    timestamp;
    metadata;
};
exports.ProtocolHealthMetric = ProtocolHealthMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProtocolHealthMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProtocolHealthMetric.prototype, "protocolId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 36, scale: 18 }),
    __metadata("design:type", Number)
], ProtocolHealthMetric.prototype, "tvl", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 36, scale: 18 }),
    __metadata("design:type", Number)
], ProtocolHealthMetric.prototype, "dailyTransactionVolume", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 36, scale: 18 }),
    __metadata("design:type", Number)
], ProtocolHealthMetric.prototype, "weeklyTransactionVolume", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 36, scale: 18 }),
    __metadata("design:type", Number)
], ProtocolHealthMetric.prototype, "walletGrowthRate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], ProtocolHealthMetric.prototype, "healthScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ProtocolHealthMetric.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProtocolHealthMetric.prototype, "metadata", void 0);
exports.ProtocolHealthMetric = ProtocolHealthMetric = __decorate([
    (0, typeorm_1.Entity)('protocol_health_metrics')
], ProtocolHealthMetric);
//# sourceMappingURL=protocol-health-metric.entity.js.map