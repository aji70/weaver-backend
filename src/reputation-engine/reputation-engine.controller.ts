import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReputationEngineService } from './reputation-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReputationScore } from './entities/reputation-score.entity';

@Controller('reputation')
@UseGuards(JwtAuthGuard)
export class ReputationEngineController {
  constructor(private readonly reputationService: ReputationEngineService) {}

  @Get(':userId')
  async getReputationScore(@Param('userId') userId: string): Promise<ReputationScore> {
    return this.reputationService.getReputationScore(userId);
  }

  @Post(':userId/recalculate')
  async recalculateScore(@Param('userId') userId: string): Promise<ReputationScore> {
    await this.reputationService.recalculateScore(userId);
    return this.reputationService.getReputationScore(userId);
  }
} 