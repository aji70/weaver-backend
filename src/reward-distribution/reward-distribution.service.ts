import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Reward, RewardStatus } from './entities/reward.entity';
import { RewardClaim, ClaimStatus } from './entities/reward-claim.entity';
import { AssignRewardDto } from './dto/assign-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';

@Injectable()
export class RewardDistributionService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(RewardClaim)
    private claimRepository: Repository<RewardClaim>,
    @InjectQueue('rewards')
    private rewardsQueue: Queue,
  ) {}

  async assignReward(assignRewardDto: AssignRewardDto): Promise<Reward> {
    const reward = this.rewardRepository.create({
      ...assignRewardDto,
      status: RewardStatus.ASSIGNED,
    });

    return this.rewardRepository.save(reward);
  }

  async claimReward(userId: string, claimRewardDto: ClaimRewardDto): Promise<RewardClaim> {
    const reward = await this.rewardRepository.findOne({
      where: { id: claimRewardDto.rewardId },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (reward.userId !== userId) {
      throw new BadRequestException('User is not authorized to claim this reward');
    }

    if (reward.status !== RewardStatus.ASSIGNED) {
      throw new BadRequestException('Reward is not available for claiming');
    }

    // Check for existing claims
    const existingClaim = await this.claimRepository.findOne({
      where: {
        rewardId: reward.id,
        status: In([ClaimStatus.PENDING, ClaimStatus.PROCESSING]),
      },
    });

    if (existingClaim) {
      throw new BadRequestException('Reward is already being claimed');
    }

    const claim = this.claimRepository.create({
      rewardId: reward.id,
      userId,
      walletAddress: claimRewardDto.walletAddress,
      status: ClaimStatus.PENDING,
      metadata: claimRewardDto.metadata,
    });

    const savedClaim = await this.claimRepository.save(claim);

    // Queue the claim for processing
    await this.rewardsQueue.add('process-claim', {
      claimId: savedClaim.id,
    });

    return savedClaim;
  }

  async getUserRewardHistory(
    userId: string,
    status?: RewardStatus,
  ): Promise<Reward[]> {
    const query = this.rewardRepository.createQueryBuilder('reward')
      .where('reward.userId = :userId', { userId });

    if (status) {
      query.andWhere('reward.status = :status', { status });
    }

    return query
      .orderBy('reward.createdAt', 'DESC')
      .getMany();
  }

  async getRewardClaims(
    rewardId: string,
    status?: ClaimStatus,
  ): Promise<RewardClaim[]> {
    const query = this.claimRepository.createQueryBuilder('claim')
      .where('claim.rewardId = :rewardId', { rewardId });

    if (status) {
      query.andWhere('claim.status = :status', { status });
    }

    return query
      .orderBy('claim.createdAt', 'DESC')
      .getMany();
  }

  async batchProcessClaims(claimIds: string[]): Promise<void> {
    await this.rewardsQueue.add('batch-process-claims', { claimIds });
  }
} 