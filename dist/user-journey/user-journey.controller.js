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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserJourneyController = void 0;
const common_1 = require("@nestjs/common");
const user_journey_service_1 = require("./user-journey.service");
const user_journey_dto_1 = require("./dto/user-journey.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UserJourneyController = class UserJourneyController {
    userJourneyService;
    constructor(userJourneyService) {
        this.userJourneyService = userJourneyService;
    }
    async trackEvent(userId, createEventDto) {
        createEventDto.userId = userId;
        return this.userJourneyService.trackEvent(createEventDto);
    }
    async getUserJourney(userId, startDate, endDate) {
        return this.userJourneyService.getUserJourney(userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getUserJourneySummary(userId, date) {
        return this.userJourneyService.getUserJourneySummary(userId, date ? new Date(date) : undefined);
    }
};
exports.UserJourneyController = UserJourneyController;
__decorate([
    (0, common_1.Post)(':userId/journey/event'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_journey_dto_1.CreateUserJourneyEventDto]),
    __metadata("design:returntype", Promise)
], UserJourneyController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Get)(':userId/journey'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserJourneyController.prototype, "getUserJourney", null);
__decorate([
    (0, common_1.Get)(':userId/journey/summary'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserJourneyController.prototype, "getUserJourneySummary", null);
exports.UserJourneyController = UserJourneyController = __decorate([
    (0, common_1.Controller)('analytics/user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_journey_service_1.UserJourneyService])
], UserJourneyController);
//# sourceMappingURL=user-journey.controller.js.map