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
var ReputationEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationEngineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const reputation_score_entity_1 = require("./entities/reputation-score.entity");
const reputation_calculator_service_1 = require("./services/reputation-calculator.service");
const reputation_factor_service_1 = require("./services/reputation-factor.service");
let ReputationEngineService = ReputationEngineService_1 = class ReputationEngineService {
    scoreRepository;
    calculator;
    factorService;
    logger = new common_1.Logger(ReputationEngineService_1.name);
    constructor(scoreRepository, calculator, factorService) {
        this.scoreRepository = scoreRepository;
        this.calculator = calculator;
        this.factorService = factorService;
    }
    async recalculateAllScores() {
        try {
            const scores = await this.scoreRepository.find();
            const factors = await this.factorService.getActiveFactors();
            for (const score of scores) {
                await this.recalculateScore(score.userId, factors);
            }
        }
        catch (error) {
            this.logger.error(`Failed to recalculate all scores: ${error.message}`);
        }
    }
    async recalculateScore(userId, factors) {
        try {
            const userData = await this.getUserData(userId);
            const activeFactors = factors || await this.factorService.getActiveFactors();
            const factorScores = {};
            for (const factor of activeFactors) {
                factorScores[factor.name] = this.calculator.calculateFactorScore(factor, userData);
            }
            const totalScore = this.calculator.calculateScore(factorScores, activeFactors);
            const tier = this.calculator.determineTier(totalScore);
            const score = await this.scoreRepository.findOne({ where: { userId } });
            if (score) {
                await this.scoreRepository.update(score.id, {
                    score: totalScore,
                    tier,
                    factorScores,
                    lastCalculatedAt: new Date(),
                });
            }
            else {
                await this.scoreRepository.save({
                    userId,
                    score: totalScore,
                    tier,
                    factorScores,
                    lastCalculatedAt: new Date(),
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to recalculate score for user ${userId}: ${error.message}`);
            throw error;
        }
    }
    async getReputationScore(userId) {
        const score = await this.scoreRepository.findOne({
            where: { userId },
            order: { lastCalculatedAt: 'DESC' },
        });
        if (!score) {
            throw new Error(`No reputation score found for user: ${userId}`);
        }
        return score;
    }
    async getUserData(userId) {
        return {
            transactions: [],
            claims: [],
            campaigns: [],
            accountCreatedAt: new Date(),
            kycStatus: 'UNVERIFIED',
        };
    }
};
exports.ReputationEngineService = ReputationEngineService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputationEngineService.prototype, "recalculateAllScores", null);
exports.ReputationEngineService = ReputationEngineService = ReputationEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reputation_score_entity_1.ReputationScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        reputation_calculator_service_1.ReputationCalculator,
        reputation_factor_service_1.ReputationFactorService])
], ReputationEngineService);
//# sourceMappingURL=reputation-engine.service.js.map