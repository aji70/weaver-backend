import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RewardDistributionService } from './reward-distribution.service';
import { AssignRewardDto } from './dto/assign-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RewardStatus } from './entities/reward.entity';
import { ClaimStatus } from './entities/reward-claim.entity';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardDistributionController {
  constructor(private readonly rewardDistributionService: RewardDistributionService) {}

  @Post('assign')
  @Roles('admin', 'moderator')
  async assignReward(@Body() assignRewardDto: AssignRewardDto) {
    return this.rewardDistributionService.assignReward(assignRewardDto);
  }

  @Post('claim')
  @Roles('user', 'admin', 'moderator')
  async claimReward(
    @Request() req,
    @Body() claimRewardDto: ClaimRewardDto,
  ) {
    return this.rewardDistributionService.claimReward(req.user.id, claimRewardDto);
  }

  @Get('history/:userId')
  @Roles('admin', 'moderator')
  async getUserRewardHistory(
    @Param('userId') userId: string,
    @Query('status') status?: RewardStatus,
  ) {
    return this.rewardDistributionService.getUserRewardHistory(userId, status);
  }

  @Get('claims/:rewardId')
  @Roles('admin', 'moderator')
  async getRewardClaims(
    @Param('rewardId') rewardId: string,
    @Query('status') status?: ClaimStatus,
  ) {
    return this.rewardDistributionService.getRewardClaims(rewardId, status);
  }

  @Post('batch-process')
  @Roles('admin')
  async batchProcessClaims(@Body() body: { claimIds: string[] }) {
    await this.rewardDistributionService.batchProcessClaims(body.claimIds);
    return { message: 'Batch processing started' };
  }
} 