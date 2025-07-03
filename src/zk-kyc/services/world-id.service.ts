import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ZkKycVerification,
  ZkKycVerificationDocument,
  ProviderType,
} from '../entities/zk-kyc-verification.entity';

export interface WorldIdVerificationRequest {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  signal?: string;
}

export interface WorldIdVerificationResponse {
  success: boolean;
  error?: string;
  detail?: string;
}

export interface WorldIdProofData {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: 'device' | 'orb';
  app_id: string;
  action: string;
  signal?: string;
}

@Injectable()
export class WorldIdService {
  private readonly logger = new Logger(WorldIdService.name);
  private readonly worldIdApiUrl = 'https://developer.worldcoin.org/api/v1';

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ZkKycVerification.name)
    private readonly zkKycModel: Model<ZkKycVerificationDocument>,
  ) {}

  /**
   * Verify a World ID proof using the World ID API
   */
  async verifyProof(
    proofData: WorldIdProofData,
  ): Promise<WorldIdVerificationResponse> {
    try {
      const appId = this.configService.get<string>('WORLD_ID_APP_ID');
      const action =
        proofData.action || this.configService.get<string>('WORLD_ID_ACTION');

      if (!appId) {
        throw new Error('WORLD_ID_APP_ID environment variable is required');
      }

      if (!action) {
        throw new Error('WORLD_ID_ACTION environment variable is required');
      }

      const verificationRequest: WorldIdVerificationRequest = {
        proof: proofData.proof,
        merkle_root: proofData.merkle_root,
        nullifier_hash: proofData.nullifier_hash,
        signal: proofData.signal,
      };

      this.logger.debug(
        `Verifying World ID proof for app ${appId}, action ${action}`,
      );

      const response = await fetch(
        `${this.worldIdApiUrl}/verify/${appId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verificationRequest),
        },
      );

      const result = (await response.json()) as {
        error?: string;
        detail?: string;
      };

      if (response.ok) {
        this.logger.log('World ID proof verification successful');
        return { success: true };
      } else {
        this.logger.warn(
          `World ID proof verification failed: ${result.detail || result.error}`,
        );
        return {
          success: false,
          error: result.error,
          detail: result.detail,
        };
      }
    } catch (error) {
      this.logger.error('Error verifying World ID proof:', error);
      return {
        success: false,
        error: 'verification_failed',
        detail: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate a verification URL for frontend integration
   */
  generateVerificationUrl(
    signal?: string,
    action?: string,
  ): { appId: string; action: string; signal?: string } {
    const appId = this.configService.get<string>('WORLD_ID_APP_ID');
    const defaultAction = this.configService.get<string>('WORLD_ID_ACTION');

    if (!appId) {
      throw new Error('WORLD_ID_APP_ID environment variable is required');
    }

    return {
      appId,
      action: action || defaultAction || 'verify-human',
      signal,
    };
  }

  /**
   * Validate World ID configuration
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const appId = this.configService.get<string>('WORLD_ID_APP_ID');
    const action = this.configService.get<string>('WORLD_ID_ACTION');

    if (!appId) {
      errors.push('WORLD_ID_APP_ID environment variable is required');
    }

    if (!action) {
      errors.push('WORLD_ID_ACTION environment variable is required');
    }

    // Validate app ID format (should start with 'app_')
    if (appId && !appId.startsWith('app_')) {
      errors.push('WORLD_ID_APP_ID should start with "app_"');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if nullifier hash has been used before (for preventing double verification)
   */
  async isNullifierUsed(nullifierHash: string): Promise<boolean> {
    const existingVerification = await this.zkKycModel.findOne({
      nullifierHash,
      provider: ProviderType.WORLD_ID,
    });

    return !!existingVerification;
  }

  /**
   * Get verification level from proof data
   */
  getVerificationLevel(proofData: WorldIdProofData): 'device' | 'orb' {
    return proofData.verification_level;
  }

  /**
   * Extract signal from proof if present
   */
  extractSignal(proofData: WorldIdProofData): string | undefined {
    return proofData.signal;
  }
}
