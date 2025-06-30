"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationEngineModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const reputation_engine_service_1 = require("./reputation-engine.service");
const reputation_engine_controller_1 = require("./reputation-engine.controller");
const reputation_score_entity_1 = require("./entities/reputation-score.entity");
const reputation_factor_entity_1 = require("./entities/reputation-factor.entity");
const reputation_calculator_service_1 = require("./services/reputation-calculator.service");
const reputation_factor_service_1 = require("./services/reputation-factor.service");
let ReputationEngineModule = class ReputationEngineModule {
};
exports.ReputationEngineModule = ReputationEngineModule;
exports.ReputationEngineModule = ReputationEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([reputation_score_entity_1.ReputationScore, reputation_factor_entity_1.ReputationFactor]),
        ],
        controllers: [reputation_engine_controller_1.ReputationEngineController],
        providers: [
            reputation_engine_service_1.ReputationEngineService,
            reputation_calculator_service_1.ReputationCalculator,
            reputation_factor_service_1.ReputationFactorService,
        ],
        exports: [reputation_engine_service_1.ReputationEngineService],
    })
], ReputationEngineModule);
//# sourceMappingURL=reputation-engine.module.js.map