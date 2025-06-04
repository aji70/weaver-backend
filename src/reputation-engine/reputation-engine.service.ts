import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReputationScore } from './entities/reputation-score.entity';
import { ReputationCalculator } from './services/reputation-calculator.service';
import { ReputationFactorService } from './services/reputation-factor.service';

@Injectable()
export class ReputationEngineService {
  private readonly logger = new Logger(ReputationEngineService.name);

  constructor(
    @InjectRepository(ReputationScore)
    private readonly scoreRepository: Repository<ReputationScore>,
    private readonly calculator: ReputationCalculator,
    private readonly factorService: ReputationFactorService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async recalculateAllScores() {
    try {
      const scores = await this.scoreRepository.find();
      const factors = await this.factorService.getActiveFactors();

      for (const score of scores) {
        await this.recalculateScore(score.userId, factors);
      }
    } catch (error) {
      this.logger.error(`Failed to recalculate all scores: ${error.message}`);
    }
  }

  async recalculateScore(userId: string, factors?: any[]) {
    try {
      const userData = await this.getUserData(userId);
      const activeFactors = factors || await this.factorService.getActiveFactors();
      
      const factorScores: Record<string, number> = {};
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
      } else {
        await this.scoreRepository.save({
          userId,
          score: totalScore,
          tier,
          factorScores,
          lastCalculatedAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error(`Failed to recalculate score for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getReputationScore(userId: string): Promise<ReputationScore> {
    const score = await this.scoreRepository.findOne({
      where: { userId },
      order: { lastCalculatedAt: 'DESC' },
    });

    if (!score) {
      throw new Error(`No reputation score found for user: ${userId}`);
    }

    return score;
  }

  private async getUserData(userId: string): Promise<Record<string, any>> {
    // TODO: Implement actual user data fetching from various sources
    // This is a placeholder implementation
    return {
      transactions: [],
      claims: [],
      campaigns: [],
      accountCreatedAt: new Date(),
      kycStatus: 'UNVERIFIED',
    };
  }
} 