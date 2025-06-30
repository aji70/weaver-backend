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
exports.UserJourneyEventSchema = exports.UserJourneyEvent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UserJourneyEvent = class UserJourneyEvent {
    userId;
    sessionId;
    actionType;
    actionName;
    actionData;
    timestamp;
    duration;
    previousAction;
    nextAction;
    success;
    errorMessage;
    metadata;
};
exports.UserJourneyEvent = UserJourneyEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "actionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "actionName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Object)
], UserJourneyEvent.prototype, "actionData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], UserJourneyEvent.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], UserJourneyEvent.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "previousAction", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "nextAction", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], UserJourneyEvent.prototype, "success", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserJourneyEvent.prototype, "errorMessage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Object)
], UserJourneyEvent.prototype, "metadata", void 0);
exports.UserJourneyEvent = UserJourneyEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserJourneyEvent);
exports.UserJourneyEventSchema = mongoose_1.SchemaFactory.createForClass(UserJourneyEvent);
exports.UserJourneyEventSchema.index({ userId: 1, timestamp: -1 });
exports.UserJourneyEventSchema.index({ sessionId: 1, timestamp: -1 });
exports.UserJourneyEventSchema.index({ actionType: 1, timestamp: -1 });
//# sourceMappingURL=user-journey-event.schema.js.map