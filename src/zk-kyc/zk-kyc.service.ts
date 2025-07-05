import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ZkKycVerification,
  ZkKycVerificationDocument,
  ProviderType,
  VerificationLevel,
  VerificationStatus,
} from './entities/zk-kyc-verification.entity';
import { WorldIdService, WorldIdProofData } from './services/world-id.service';

export interface VerifyWorldIdRequest {
  walletAddress: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: 'device' | 'orb';
  app_id: string;
  action: string;
  signal?: string;
}

export interface VerificationStatusResponse {
  isVerified: boolean;
  provider: ProviderType;
  verificationLevel: VerificationLevel;
  status: VerificationStatus;
  verifiedAt?: Date;
  expiresAt?: Date;
}

export interface CampaignEligibilityCheck {
  isEligible: boolean;
  requiredLevel?: VerificationLevel;
  userLevel?: VerificationLevel;
  reason?: string;
}

@Injectable()
export class ZkKycService {
  private readonly logger = new Logger(ZkKycService.name);

  constructor(
    @InjectModel(ZkKycVerification.name)
    private readonly zkKycModel: Model<ZkKycVerificationDocument>,
    private readonly worldIdService: WorldIdService,
  ) {}

  /**
   * Verify a user with World ID
   */
  async verifyWithWorldId(request: VerifyWorldIdRequest) {
    this.logger.log(`Verifying World ID for wallet: ${request.walletAddress}`);

    // Check if user is already verified with this provider
    const existingVerification = await this.zkKycModel.findOne({
      walletAddress: request.walletAddress,
      provider: ProviderType.WORLD_ID,
    });

    if (existingVerification && existingVerification.isValidForUse()) {
      throw new ConflictException('User is already verified with World ID');
    }

    // Check if nullifier hash has been used before (prevent double verification)
    const nullifierExists = await this.zkKycModel.findOne({
      nullifierHash: request.nullifier_hash,
      provider: ProviderType.WORLD_ID,
    });

    if (nullifierExists) {
      throw new ConflictException(
        'This World ID has already been used for verification',
      );
    }

    // Verify the proof with World ID
    const proofData: WorldIdProofData = {
      merkle_root: request.merkle_root,
      nullifier_hash: request.nullifier_hash,
      proof: request.proof,
      verification_level: request.verification_level,
      app_id: request.app_id,
      action: request.action,
      signal: request.signal,
    };

    const verificationResult = await this.worldIdService.verifyProof(proofData);

    if (!verificationResult.success) {
      this.logger.warn(
        `World ID verification failed for ${request.walletAddress}: ${verificationResult.detail}`,
      );
      throw new BadRequestException(
        `Verification failed: ${verificationResult.detail || verificationResult.error}`,
      );
    }

    // Create or update verification record
    const verificationLevel =
      request.verification_level === 'orb'
        ? VerificationLevel.ORB
        : VerificationLevel.DEVICE;

    const verificationData = {
      walletAddress: request.walletAddress,
      provider: ProviderType.WORLD_ID,
      verificationLevel,
      status: VerificationStatus.VERIFIED,
      nullifierHash: request.nullifier_hash,
      merkleRoot: request.merkle_root,
      proof: request.proof, // In production, encrypt this
      appId: request.app_id,
      action: request.action,
      signal: request.signal,
      verifiedAt: new Date(),
      expiresAt: this.calculateExpiryDate(verificationLevel),
      metadata: {
        verificationLevel: request.verification_level,
        timestamp: new Date().toISOString(),
      },
    };

    let savedVerification: ZkKycVerificationDocument;
    if (existingVerification) {
      Object.assign(existingVerification, verificationData);
      savedVerification = await existingVerification.save();
    } else {
      savedVerification = await this.zkKycModel.create(verificationData);
    }

    this.logger.log(
      `World ID verification successful for ${request.walletAddress} with level ${verificationLevel}`,
    );

    return savedVerification;
  }

  /**
   * Get verification status for a wallet address
   */
  async getVerificationStatus(
    walletAddress: string,
    provider?: ProviderType,
  ): Promise<VerificationStatusResponse | null> {
    const query: { walletAddress: string; provider?: ProviderType } = {
      walletAddress,
    };
    if (provider) {
      query.provider = provider;
    }

    const verification = await this.zkKycModel
      .findOne(query)
      .sort({ verifiedAt: -1 }) // Get the most recent verification
      .exec();

    if (!verification) {
      return null;
    }

    return {
      isVerified: verification.isValidForUse(),
      provider: verification.provider,
      verificationLevel: verification.verificationLevel,
      status: verification.status,
      verifiedAt: verification.verifiedAt,
      expiresAt: verification.expiresAt,
    };
  }

  /**
   * Check if a user is eligible for a campaign based on KYC requirements
   */
  async checkCampaignEligibility(
    walletAddress: string,
    requiredLevel: VerificationLevel,
    requiredProvider?: ProviderType,
  ): Promise<CampaignEligibilityCheck> {
    const verification = await this.getVerificationStatus(
      walletAddress,
      requiredProvider,
    );

    if (!verification) {
      return {
        isEligible: false,
        requiredLevel,
        reason: 'No verification found',
      };
    }

    if (!verification.isVerified) {
      return {
        isEligible: false,
        requiredLevel,
        userLevel: verification.verificationLevel,
        reason: 'Verification not valid or expired',
      };
    }

    // Check if user's verification level meets requirements
    const isLevelSufficient = this.compareVerificationLevels(
      verification.verificationLevel,
      requiredLevel,
    );

    return {
      isEligible: isLevelSufficient,
      requiredLevel,
      userLevel: verification.verificationLevel,
      reason: isLevelSufficient ? undefined : 'Insufficient verification level',
    };
  }

  /**
   * Get all verifications for a wallet
   */
  async getUserVerifications(walletAddress: string) {
    return this.zkKycModel
      .find({ walletAddress })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Revoke a verification (for admin use)
   */
  async revokeVerification(verificationId: string): Promise<void> {
    await this.zkKycModel.findByIdAndUpdate(verificationId, {
      status: VerificationStatus.REVOKED,
      updatedAt: new Date(),
    });

    this.logger.log(`Verification ${verificationId} has been revoked`);
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats(): Promise<{
    total: number;
    byProvider: Record<ProviderType, number>;
    byLevel: Record<VerificationLevel, number>;
    byStatus: Record<VerificationStatus, number>;
  }> {
    const total = await this.zkKycModel.countDocuments();

    const [byProvider, byLevel, byStatus] = await Promise.all([
      this.zkKycModel.aggregate<{ _id: ProviderType; count: number }>([
        { $group: { _id: '$provider', count: { $sum: 1 } } },
      ]),
      this.zkKycModel.aggregate<{ _id: VerificationLevel; count: number }>([
        { $group: { _id: '$verificationLevel', count: { $sum: 1 } } },
      ]),
      this.zkKycModel.aggregate<{ _id: VerificationStatus; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      byProvider: byProvider.reduce(
        (acc, item: { _id: ProviderType; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<ProviderType, number>,
      ),
      byLevel: byLevel.reduce(
        (acc, item: { _id: VerificationLevel; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<VerificationLevel, number>,
      ),
      byStatus: byStatus.reduce(
        (acc, item: { _id: VerificationStatus; count: number }) => ({
          ...acc,
          [item._id]: item.count,
        }),
        {} as Record<VerificationStatus, number>,
      ),
    };
  }

  /**
   * Generate World ID verification config for frontend
   */
  generateWorldIdConfig(signal?: string): {
    appId: string;
    action: string;
    signal?: string;
  } {
    return this.worldIdService.generateVerificationUrl(signal);
  }

  /**
   * Private helper methods
   */
  private calculateExpiryDate(level: VerificationLevel): Date {
    const now = new Date();
    const expiryMonths = level === VerificationLevel.ORB ? 12 : 6; // Orb verifications last longer
    return new Date(now.setMonth(now.getMonth() + expiryMonths));
  }

  private compareVerificationLevels(
    userLevel: VerificationLevel,
    requiredLevel: VerificationLevel,
  ): boolean {
    const levelHierarchy = {
      [VerificationLevel.BASIC]: 1,
      [VerificationLevel.DEVICE]: 2,
      [VerificationLevel.ORB]: 3,
      [VerificationLevel.FULL_KYC]: 4,
    };

    return levelHierarchy[userLevel] >= levelHierarchy[requiredLevel];
  }
}
