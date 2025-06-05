import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProtocolHealthMetric } from './entities/protocol-health-metric.entity';
import { ProtocolAdapterFactory } from './adapters/protocol-adapter.factory';
import { ProtocolMetrics } from './adapters/protocol-adapter.interface';

@Injectable()
export class ProtocolHealthService {
  private readonly logger = new Logger(ProtocolHealthService.name);

  constructor(
    @InjectRepository(ProtocolHealthMetric)
    private readonly metricsRepository: Repository<ProtocolHealthMetric>,
    private readonly adapterFactory: ProtocolAdapterFactory,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async collectMetrics() {
    try {
      const adapters = this.adapterFactory.getAllAdapters();
      
      for (const adapter of adapters) {
        try {
          const metrics = await adapter.getProtocolMetrics();
          await this.saveMetrics(adapter.getProtocolId(), metrics);
        } catch (error) {
          this.logger.error(`Failed to collect metrics for protocol ${adapter.getProtocolId()}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to collect protocol metrics: ${error.message}`);
    }
  }

  private async saveMetrics(protocolId: string, metrics: ProtocolMetrics) {
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

  private calculateHealthScore(metrics: ProtocolMetrics): number {
    // Implement your health score calculation logic here
    // This is a simple example - you might want to make this more sophisticated
    const tvlWeight = 0.4;
    const volumeWeight = 0.3;
    const growthWeight = 0.3;

    const normalizedTvl = Math.min(metrics.tvl / 1e9, 1); // Normalize TVL to 0-1 range
    const normalizedVolume = Math.min(metrics.dailyTransactionVolume / 1e6, 1); // Normalize volume
    const normalizedGrowth = Math.min(metrics.walletGrowthRate, 1); // Growth rate as is

    return (
      normalizedTvl * tvlWeight +
      normalizedVolume * volumeWeight +
      normalizedGrowth * growthWeight
    ) * 100; // Convert to percentage
  }

  async getProtocolHealth(protocolId: string) {
    const latestMetric = await this.metricsRepository.findOne({
      where: { protocolId },
      order: { timestamp: 'DESC' },
    });

    if (!latestMetric) {
      throw new Error(`No health metrics found for protocol: ${protocolId}`);
    }

    return latestMetric;
  }

  async getProtocolHealthHistory(protocolId: string, days: number = 7) {
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
} 