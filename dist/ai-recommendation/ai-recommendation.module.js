"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ai_recommendation_controller_1 = require("./ai-recommendation.controller");
const ai_recommendation_service_1 = require("./ai-recommendation.service");
const recommendation_entity_1 = require("./entities/recommendation.entity");
const alert_entity_1 = require("./entities/alert.entity");
const analytics_module_1 = require("../x-analytics/analytics.module");
const bull_1 = require("@nestjs/bull");
const recommendation_processor_1 = require("./processors/recommendation.processor");
let AiRecommendationModule = class AiRecommendationModule {
};
exports.AiRecommendationModule = AiRecommendationModule;
exports.AiRecommendationModule = AiRecommendationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([recommendation_entity_1.Recommendation, alert_entity_1.Alert]),
            bull_1.BullModule.registerQueue({
                name: 'recommendations',
            }),
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [ai_recommendation_controller_1.AiRecommendationController],
        providers: [ai_recommendation_service_1.AiRecommendationService, recommendation_processor_1.RecommendationProcessor],
        exports: [ai_recommendation_service_1.AiRecommendationService],
    })
], AiRecommendationModule);
//# sourceMappingURL=ai-recommendation.module.js.map