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
exports.UserJourneyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const user_journey_event_schema_1 = require("./schemas/user-journey-event.schema");
const user_journey_summary_schema_1 = require("./schemas/user-journey-summary.schema");
let UserJourneyService = class UserJourneyService {
    userJourneyEventModel;
    userJourneySummaryModel;
    constructor(userJourneyEventModel, userJourneySummaryModel) {
        this.userJourneyEventModel = userJourneyEventModel;
        this.userJourneySummaryModel = userJourneySummaryModel;
    }
    async trackEvent(createEventDto) {
        const event = new this.userJourneyEventModel({
            ...createEventDto,
            timestamp: createEventDto.timestamp || new Date(),
        });
        return event.save();
    }
    async getUserJourney(userId, startDate, endDate) {
        const query = { userId };
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate)
                query.timestamp.$gte = startDate;
            if (endDate)
                query.timestamp.$lte = endDate;
        }
        return this.userJourneyEventModel.find(query).sort({ timestamp: 1 }).exec();
    }
    async getUserJourneySummary(userId, date) {
        const queryDate = date || new Date();
        queryDate.setHours(0, 0, 0, 0);
        return this.userJourneySummaryModel.findOne({
            userId,
            date: queryDate,
        }).exec();
    }
    async aggregateDailyJourneys() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await this.userJourneyEventModel.find({
            timestamp: {
                $gte: yesterday,
                $lt: today,
            },
        }).exec();
        const userSummaries = new Map();
        for (const event of events) {
            if (!userSummaries.has(event.userId)) {
                userSummaries.set(event.userId, {
                    userId: event.userId,
                    date: yesterday,
                    sessionCount: new Set(),
                    totalActions: 0,
                    actionTypeCounts: new Map(),
                    actionNameCounts: new Map(),
                    actionDurations: new Map(),
                    successRates: new Map(),
                    commonFlows: new Map(),
                    dropOffPoints: new Map(),
                    totalSessionDuration: 0,
                    completedSessions: 0,
                });
            }
            const summary = userSummaries.get(event.userId);
            summary.sessionCount.add(event.sessionId);
            summary.totalActions++;
            summary.actionTypeCounts.set(event.actionType, (summary.actionTypeCounts.get(event.actionType) || 0) + 1);
            summary.actionNameCounts.set(event.actionName, (summary.actionNameCounts.get(event.actionName) || 0) + 1);
            if (event.duration) {
                summary.actionDurations.set(event.actionName, (summary.actionDurations.get(event.actionName) || 0) + event.duration);
            }
            if (event.success !== undefined) {
                const current = summary.successRates.get(event.actionName) || { success: 0, total: 0 };
                current.success += event.success ? 1 : 0;
                current.total += 1;
                summary.successRates.set(event.actionName, current);
            }
            if (event.previousAction && event.nextAction) {
                const flowKey = `${event.previousAction}->${event.nextAction}`;
                const flow = summary.commonFlows.get(flowKey) || [];
                flow.push(event.actionName);
                summary.commonFlows.set(flowKey, flow);
            }
            if (event.nextAction === null) {
                summary.dropOffPoints.set(event.actionName, (summary.dropOffPoints.get(event.actionName) || 0) + 1);
            }
            if (event.duration) {
                summary.totalSessionDuration += event.duration;
            }
            if (event.actionName === 'session_complete') {
                summary.completedSessions++;
            }
        }
        for (const summary of userSummaries.values()) {
            const sessionCount = summary.sessionCount.size;
            const averageSessionDuration = sessionCount > 0 ? summary.totalSessionDuration / sessionCount : 0;
            const completionRate = sessionCount > 0 ? (summary.completedSessions / sessionCount) * 100 : 0;
            const finalSummary = {
                userId: summary.userId,
                date: summary.date,
                sessionCount,
                totalActions: summary.totalActions,
                actionTypeCounts: Object.fromEntries(summary.actionTypeCounts),
                actionNameCounts: Object.fromEntries(summary.actionNameCounts),
                actionDurations: Object.fromEntries(summary.actionDurations),
                successRates: Object.fromEntries(Array.from(summary.successRates.entries()).map(([key, value]) => [
                    key,
                    value.total > 0 ? (value.success / value.total) * 100 : 0,
                ])),
                commonFlows: Object.fromEntries(summary.commonFlows),
                dropOffPoints: Object.fromEntries(summary.dropOffPoints),
                averageSessionDuration,
                completionRate,
            };
            await this.userJourneySummaryModel.findOneAndUpdate({ userId: summary.userId, date: summary.date }, finalSummary, { upsert: true, new: true });
        }
    }
};
exports.UserJourneyService = UserJourneyService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserJourneyService.prototype, "aggregateDailyJourneys", null);
exports.UserJourneyService = UserJourneyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_journey_event_schema_1.UserJourneyEvent.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_journey_summary_schema_1.UserJourneySummary.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserJourneyService);
//# sourceMappingURL=user-journey.service.js.map