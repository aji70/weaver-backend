"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardDistributionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reward_distribution_controller_1 = require("./reward-distribution.controller");
const reward_distribution_service_1 = require("./reward-distribution.service");
const reward_entity_1 = require("./entities/reward.entity");
const reward_claim_entity_1 = require("./entities/reward-claim.entity");
const bull_1 = require("@nestjs/bull");
const reward_processor_1 = require("./processors/reward.processor");
const config_1 = require("@nestjs/config");
let RewardDistributionModule = class RewardDistributionModule {
};
exports.RewardDistributionModule = RewardDistributionModule;
exports.RewardDistributionModule = RewardDistributionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reward_entity_1.Reward, reward_claim_entity_1.RewardClaim]),
            bull_1.BullModule.registerQueue({
                name: 'rewards',
            }),
            config_1.ConfigModule,
        ],
        controllers: [reward_distribution_controller_1.RewardDistributionController],
        providers: [reward_distribution_service_1.RewardDistributionService, reward_processor_1.RewardProcessor],
        exports: [reward_distribution_service_1.RewardDistributionService],
    })
], RewardDistributionModule);
//# sourceMappingURL=reward-distribution.module.js.map