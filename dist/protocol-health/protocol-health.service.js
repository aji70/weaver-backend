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
var ProtocolHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolHealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const protocol_health_metric_entity_1 = require("./entities/protocol-health-metric.entity");
const protocol_adapter_factory_1 = require("./adapters/protocol-adapter.factory");
let ProtocolHealthService = ProtocolHealthService_1 = class ProtocolHealthService {
    metricsRepository;
    adapterFactory;
    logger = new common_1.Logger(ProtocolHealthService_1.name);
    constructor(metricsRepository, adapterFactory) {
        this.metricsRepository = metricsRepository;
        this.adapterFactory = adapterFactory;
    }
    async collectMetrics() {
        try {
            const adapters = this.adapterFactory.getAllAdapters();
            for (const adapter of adapters) {
                try {
                    const metrics = await adapter.getProtocolMetrics();
                    await this.saveMetrics(adapter.getProtocolId(), metrics);
                }
                catch (error) {
                    this.logger.error(`Failed to collect metrics for protocol ${adapter.getProtocolId()}: ${error.message}`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Failed to collect protocol metrics: ${error.message}`);
        }
    }
    async saveMetrics(protocolId, metrics) {
        const healthScore = this.calculateHealthScore(metrics);
        const metric = this.metricsRepository.create({
            protocolId,
            ...metrics,
            healthScore,
            metadata: {
                lastUpdated: new Date().toISOString(),
            },
        });
        await this.metricsRepository.save(metric);
    }
    calculateHealthScore(metrics) {
        const tvlWeight = 0.4;
        const volumeWeight = 0.3;
        const growthWeight = 0.3;
        const normalizedTvl = Math.min(metrics.tvl / 1e9, 1);
        const normalizedVolume = Math.min(metrics.dailyTransactionVolume / 1e6, 1);
        const normalizedGrowth = Math.min(metrics.walletGrowthRate, 1);
        return (normalizedTvl * tvlWeight +
            normalizedVolume * volumeWeight +
            normalizedGrowth * growthWeight) * 100;
    }
    async getProtocolHealth(protocolId) {
        const latestMetric = await this.metricsRepository.findOne({
            where: { protocolId },
            order: { timestamp: 'DESC' },
        });
        if (!latestMetric) {
            throw new Error(`No health metrics found for protocol: ${protocolId}`);
        }
        return latestMetric;
    }
    async getProtocolHealthHistory(protocolId, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.metricsRepository.find({
            where: {
                protocolId,
                timestamp: { $gte: startDate },
            },
            order: { timestamp: 'ASC' },
        });
    }
};
exports.ProtocolHealthService = ProtocolHealthService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProtocolHealthService.prototype, "collectMetrics", null);
exports.ProtocolHealthService = ProtocolHealthService = ProtocolHealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(protocol_health_metric_entity_1.ProtocolHealthMetric)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        protocol_adapter_factory_1.ProtocolAdapterFactory])
], ProtocolHealthService);
//# sourceMappingURL=protocol-health.service.js.map