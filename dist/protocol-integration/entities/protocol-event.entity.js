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
exports.ProtocolEvent = exports.ProtocolEventType = void 0;
const typeorm_1 = require("typeorm");
var ProtocolEventType;
(function (ProtocolEventType) {
    ProtocolEventType["REWARD_CLAIM"] = "REWARD_CLAIM";
    ProtocolEventType["TOKEN_TRANSFER"] = "TOKEN_TRANSFER";
    ProtocolEventType["NFT_MINT"] = "NFT_MINT";
})(ProtocolEventType || (exports.ProtocolEventType = ProtocolEventType = {}));
let ProtocolEvent = class ProtocolEvent {
    id;
    protocolId;
    eventType;
    payload;
    blockNumber;
    transactionHash;
    timestamp;
    processed;
    error;
};
exports.ProtocolEvent = ProtocolEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProtocolEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProtocolEvent.prototype, "protocolId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProtocolEventType,
    }),
    __metadata("design:type", String)
], ProtocolEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], ProtocolEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProtocolEvent.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProtocolEvent.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProtocolEvent.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProtocolEvent.prototype, "processed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProtocolEvent.prototype, "error", void 0);
exports.ProtocolEvent = ProtocolEvent = __decorate([
    (0, typeorm_1.Entity)('protocol_events')
], ProtocolEvent);
//# sourceMappingURL=protocol-event.entity.js.map