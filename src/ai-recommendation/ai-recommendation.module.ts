import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiRecommendationController } from './ai-recommendation.controller';
import { AiRecommendationService } from './ai-recommendation.service';
import { Recommendation } from './entities/recommendation.entity';
import { Alert } from './entities/alert.entity';
import { AnalyticsModule } from '../x-analytics/analytics.module';
import { BullModule } from '@nestjs/bull';
import { RecommendationProcessor } from './processors/recommendation.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, Alert]),
    BullModule.registerQueue({
      name: 'recommendations',
    }),
    AnalyticsModule,
  ],
  controllers: [AiRecommendationController],
  providers: [AiRecommendationService, RecommendationProcessor],
  exports: [AiRecommendationService],
})
export class AiRecommendationModule {} 