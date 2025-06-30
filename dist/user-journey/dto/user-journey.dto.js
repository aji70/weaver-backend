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
exports.UserJourneySummaryResponseDto = exports.UserJourneyEventResponseDto = exports.CreateUserJourneyEventDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserJourneyEventDto {
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
}
exports.CreateUserJourneyEventDto = CreateUserJourneyEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "actionType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "actionName", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateUserJourneyEventDto.prototype, "actionData", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateUserJourneyEventDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserJourneyEventDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "previousAction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "nextAction", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUserJourneyEventDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserJourneyEventDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateUserJourneyEventDto.prototype, "metadata", void 0);
class UserJourneyEventResponseDto {
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
}
exports.UserJourneyEventResponseDto = UserJourneyEventResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "actionType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "actionName", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserJourneyEventResponseDto.prototype, "actionData", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserJourneyEventResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserJourneyEventResponseDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "previousAction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "nextAction", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UserJourneyEventResponseDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserJourneyEventResponseDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserJourneyEventResponseDto.prototype, "metadata", void 0);
class UserJourneySummaryResponseDto {
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
}
exports.UserJourneySummaryResponseDto = UserJourneySummaryResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserJourneySummaryResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserJourneySummaryResponseDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserJourneySummaryResponseDto.prototype, "sessionCount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserJourneySummaryResponseDto.prototype, "totalActions", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "actionTypeCounts", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "actionNameCounts", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "actionDurations", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "successRates", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "commonFlows", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "dropOffPoints", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserJourneySummaryResponseDto.prototype, "averageSessionDuration", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserJourneySummaryResponseDto.prototype, "completionRate", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserJourneySummaryResponseDto.prototype, "metadata", void 0);
//# sourceMappingURL=user-journey.dto.js.map