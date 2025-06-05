import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Reward, RewardStatus, TokenType } from '../entities/reward.entity';
import { RewardClaim, ClaimStatus } from '../entities/reward-claim.entity';

@Injectable()
@Processor('rewards')
export class RewardProcessor {
  private readonly logger = new Logger(RewardProcessor.name);
  private readonly provider: ethers.Provider;
  private readonly wallet: ethers.Wallet;

  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(RewardClaim)
    private claimRepository: Repository<RewardClaim>,
    private configService: ConfigService,
  ) {
    // Initialize provider and wallet
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('ETHEREUM_RPC_URL'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('REWARD_WALLET_PRIVATE_KEY'),
      this.provider,
    );
  }

  @Process('process-claim')
  async handleClaim(job: Job<{ claimId: string }>) {
    const { claimId } = job.data;
    const claim = await this.claimRepository.findOne({
      where: { id: claimId },
      relations: ['reward'],
    });

    if (!claim || !claim.reward) {
      throw new Error('Claim or reward not found');
    }

    try {
      // Update claim status to processing
      claim.status = ClaimStatus.PROCESSING;
      claim.processedAt = new Date();
      await this.claimRepository.save(claim);

      // Process the reward transfer
      const txHash = await this.processTransfer(claim);

      // Update claim and reward status
      claim.status = ClaimStatus.COMPLETED;
      claim.transactionHash = txHash;
      claim.completedAt = new Date();
      await this.claimRepository.save(claim);

      claim.reward.status = RewardStatus.CLAIMED;
      claim.reward.transactionHash = txHash;
      await this.rewardRepository.save(claim.reward);

      this.logger.log(`Successfully processed claim ${claimId} with tx ${txHash}`);
    } catch (error) {
      this.logger.error(`Failed to process claim ${claimId}: ${error.message}`);
      
      // Update claim status to failed
      claim.status = ClaimStatus.FAILED;
      claim.error = {
        message: error.message,
        stack: error.stack,
      };
      await this.claimRepository.save(claim);
      
      throw error;
    }
  }

  private async processTransfer(claim: RewardClaim): Promise<string> {
    const { reward } = claim;
    const amount = ethers.parseEther(reward.amount.toString());

    if (reward.tokenType === TokenType.NATIVE) {
      // Send native token
      const tx = await this.wallet.sendTransaction({
        to: claim.walletAddress,
        value: amount,
      });
      return tx.hash;
    } else {
      // Send ERC20 token
      const tokenContract = new ethers.Contract(
        reward.tokenAddress,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
        ],
        this.wallet,
      );

      const tx = await tokenContract.transfer(claim.walletAddress, amount);
      return tx.hash;
    }
  }

  @Process('batch-process-claims')
  async handleBatchClaims(job: Job<{ claimIds: string[] }>) {
    const { claimIds } = job.data;
    
    // Process claims in batches to optimize gas usage
    const batchSize = 10;
    for (let i = 0; i < claimIds.length; i += batchSize) {
      const batch = claimIds.slice(i, i + batchSize);
      await Promise.all(
        batch.map(claimId =>
          this.handleClaim({ data: { claimId } } as Job<{ claimId: string }>),
        ),
      );
    }
  }
} 