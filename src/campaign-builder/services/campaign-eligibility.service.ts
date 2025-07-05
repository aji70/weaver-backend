import { Injectable, Logger } from '@nestjs/common';
import { ZkKycService } from '../../zk-kyc/zk-kyc.service';
import {
  VerificationLevel,
  ProviderType,
} from '../../zk-kyc/entities/zk-kyc-verification.entity';
import { CampaignTemplate } from '../entities/campaign-template.entity';

export interface CampaignEligibilityResult {
  isEligible: boolean;
  reasons: string[];
  kycStatus?: {
    isVerified: boolean;
    provider?: ProviderType;
    verificationLevel?: VerificationLevel;
    meetsRequirement: boolean;
  };
}

@Injectable()
export class CampaignEligibilityService {
  private readonly logger = new Logger(CampaignEligibilityService.name);

  constructor(private readonly zkKycService: ZkKycService) {}

  /**
   * Check if a user is eligible for a campaign based on all requirements
   */
  async checkEligibility(
    walletAddress: string,
    template: CampaignTemplate,
  ): Promise<CampaignEligibilityResult> {
    const result: CampaignEligibilityResult = {
      isEligible: true,
      reasons: [],
    };

    this.logger.debug(
      `Checking eligibility for wallet ${walletAddress} against campaign ${template.id}`,
    );

    // Check KYC requirements if specified
    if (template.targetingRules?.kycRequirements?.required) {
      const kycResult = await this.checkKycEligibility(
        walletAddress,
        template.targetingRules.kycRequirements,
      );

      result.kycStatus = kycResult;

      if (!kycResult.meetsRequirement) {
        result.isEligible = false;
        if (!kycResult.isVerified) {
          result.reasons.push('KYC verification required');
        } else {
          result.reasons.push(
            `Higher KYC verification level required: ${template.targetingRules.kycRequirements.verificationLevel}`,
          );
        }
      }
    }

    // TODO: Add other eligibility checks
    // - Reputation requirements
    // - NFT requirements
    // - Custom conditions

    this.logger.debug(
      `Eligibility check result for ${walletAddress}: ${result.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'} - ${result.reasons.join(', ')}`,
    );

    return result;
  }

  /**
   * Check KYC eligibility specifically
   */
  private async checkKycEligibility(
    walletAddress: string,
    kycRequirements: {
      required: boolean;
      provider?: 'world_id' | 'privado_id' | 'hypersign';
      verificationLevel?: 'device' | 'orb' | 'basic' | 'full_kyc';
    },
  ): Promise<{
    isVerified: boolean;
    provider?: ProviderType;
    verificationLevel?: VerificationLevel;
    meetsRequirement: boolean;
  }> {
    // Map string values to enums
    const requiredProvider = kycRequirements.provider
      ? this.mapStringToProviderType(kycRequirements.provider)
      : undefined;

    const requiredLevel = kycRequirements.verificationLevel
      ? this.mapStringToVerificationLevel(kycRequirements.verificationLevel)
      : VerificationLevel.DEVICE; // Default minimum level

    // Check user's verification status
    const verificationStatus = await this.zkKycService.getVerificationStatus(
      walletAddress,
      requiredProvider,
    );

    if (!verificationStatus) {
      return {
        isVerified: false,
        meetsRequirement: false,
      };
    }

    // Check if verification meets the requirements
    const eligibilityCheck = await this.zkKycService.checkCampaignEligibility(
      walletAddress,
      requiredLevel,
      requiredProvider,
    );

    return {
      isVerified: verificationStatus.isVerified,
      provider: verificationStatus.provider,
      verificationLevel: verificationStatus.verificationLevel,
      meetsRequirement: eligibilityCheck.isEligible,
    };
  }

  /**
   * Get campaign requirements summary for frontend display
   */
  getCampaignRequirements(template: CampaignTemplate): {
    kyc?: {
      required: boolean;
      provider?: string;
      verificationLevel?: string;
    };
    reputation?: {
      minReputation?: number;
    };
    nfts?: {
      requiredNfts?: string[];
    };
  } {
    const requirements: any = {};

    if (template.targetingRules?.kycRequirements?.required) {
      requirements.kyc = {
        required: true,
        provider: template.targetingRules.kycRequirements.provider,
        verificationLevel: template.targetingRules.kycRequirements.verificationLevel,
      };
    }

    if (template.targetingRules?.minReputation) {
      requirements.reputation = {
        minReputation: template.targetingRules.minReputation,
      };
    }

    if (template.targetingRules?.requiredNfts?.length) {
      requirements.nfts = {
        requiredNfts: template.targetingRules.requiredNfts,
      };
    }

    return requirements;
  }

  /**
   * Check if user can participate in campaign (quick check)
   */
  async canParticipate(
    walletAddress: string,
    template: CampaignTemplate,
  ): Promise<boolean> {
    const eligibility = await this.checkEligibility(walletAddress, template);
    return eligibility.isEligible;
  }

  /**
   * Helper methods for type mapping
   */
  private mapStringToProviderType(provider: string): ProviderType {
    switch (provider) {
      case 'world_id':
        return ProviderType.WORLD_ID;
      case 'privado_id':
        return ProviderType.PRIVADO_ID;
      case 'hypersign':
        return ProviderType.HYPERSIGN;
      default:
        return ProviderType.WORLD_ID;
    }
  }

  private mapStringToVerificationLevel(level: string): VerificationLevel {
    switch (level) {
      case 'device':
        return VerificationLevel.DEVICE;
      case 'orb':
        return VerificationLevel.ORB;
      case 'basic':
        return VerificationLevel.BASIC;
      case 'full_kyc':
        return VerificationLevel.FULL_KYC;
      default:
        return VerificationLevel.DEVICE;
    }
  }
} 