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
exports.Alert = exports.AlertType = exports.AlertSeverity = void 0;
const typeorm_1 = require("typeorm");
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "info";
    AlertSeverity["WARNING"] = "warning";
    AlertSeverity["CRITICAL"] = "critical";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var AlertType;
(function (AlertType) {
    AlertType["BOT_ACTIVITY"] = "bot_activity";
    AlertType["FARMING_DETECTED"] = "farming_detected";
    AlertType["UNUSUAL_PATTERN"] = "unusual_pattern";
    AlertType["SYSTEM_ANOMALY"] = "system_anomaly";
})(AlertType || (exports.AlertType = AlertType = {}));
let Alert = class Alert {
    id;
    type;
    severity;
    targetId;
    description;
    data;
    metrics;
    isResolved;
    resolvedAt;
    createdAt;
    updatedAt;
};
exports.Alert = Alert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Alert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AlertType
    }),
    __metadata("design:type", String)
], Alert.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AlertSeverity,
        default: AlertSeverity.WARNING
    }),
    __metadata("design:type", String)
], Alert.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Alert.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Alert.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Alert.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Alert.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Alert.prototype, "isResolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Alert.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Alert.prototype, "updatedAt", void 0);
exports.Alert = Alert = __decorate([
    (0, typeorm_1.Entity)('alerts')
], Alert);
//# sourceMappingURL=alert.entity.js.map