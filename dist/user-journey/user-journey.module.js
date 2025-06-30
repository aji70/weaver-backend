"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserJourneyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const user_journey_controller_1 = require("./user-journey.controller");
const user_journey_service_1 = require("./user-journey.service");
const user_journey_event_schema_1 = require("./schemas/user-journey-event.schema");
const user_journey_summary_schema_1 = require("./schemas/user-journey-summary.schema");
let UserJourneyModule = class UserJourneyModule {
};
exports.UserJourneyModule = UserJourneyModule;
exports.UserJourneyModule = UserJourneyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([
                { name: user_journey_event_schema_1.UserJourneyEvent.name, schema: user_journey_event_schema_1.UserJourneyEventSchema },
                { name: user_journey_summary_schema_1.UserJourneySummary.name, schema: user_journey_summary_schema_1.UserJourneySummarySchema },
            ]),
        ],
        controllers: [user_journey_controller_1.UserJourneyController],
        providers: [user_journey_service_1.UserJourneyService],
        exports: [user_journey_service_1.UserJourneyService],
    })
], UserJourneyModule);
//# sourceMappingURL=user-journey.module.js.map