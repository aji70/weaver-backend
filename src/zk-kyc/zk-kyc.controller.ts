import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ZkKycService, VerifyWorldIdRequest } from './zk-kyc.service';
import {
  ProviderType,
  VerificationLevel,
} from './entities/zk-kyc-verification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class VerifyWorldIdDto {
  walletAddress: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: 'device' | 'orb';
  app_id: string;
  action: string;
  signal?: string;
}

export class CampaignEligibilityQueryDto {
  walletAddress: string;
  requiredLevel: VerificationLevel;
  provider?: ProviderType;
}

@ApiTags('zk-kyc')
@Controller('zk-kyc')
export class ZkKycController {
  constructor(private readonly zkKycService: ZkKycService) {}

  @Post('verify/world-id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user with World ID',
    description: 'Submit World ID proof for verification and store the result',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        verificationId: { type: 'string' },
        verificationLevel: { type: 'string' },
        verifiedAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid proof or verification failed',
  })
  @ApiResponse({
    status: 409,
    description: 'User already verified or nullifier already used',
  })
  async verifyWithWorldId(@Body() verifyDto: VerifyWorldIdDto) {
    const request: VerifyWorldIdRequest = {
      walletAddress: verifyDto.walletAddress,
      proof: verifyDto.proof,
      merkle_root: verifyDto.merkle_root,
      nullifier_hash: verifyDto.nullifier_hash,
      verification_level: verifyDto.verification_level,
      app_id: verifyDto.app_id,
      action: verifyDto.action,
      signal: verifyDto.signal,
    };

    const verification = await this.zkKycService.verifyWithWorldId(request);

    return {
      success: true,
      verificationId: verification._id,
      verificationLevel: verification.verificationLevel,
      verifiedAt: verification.verifiedAt,
      expiresAt: verification.expiresAt,
    };
  }

  @Get('status/:walletAddress')
  @ApiOperation({
    summary: 'Get verification status for a wallet',
    description:
      'Check if a wallet address is verified and get verification details',
  })
  @ApiParam({
    name: 'walletAddress',
    description: 'Wallet address to check',
    type: 'string',
  })
  @ApiQuery({
    name: 'provider',
    description: 'Specific provider to check (optional)',
    enum: ProviderType,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Verification status retrieved',
    schema: {
      type: 'object',
      properties: {
        isVerified: { type: 'boolean' },
        provider: { type: 'string', enum: Object.values(ProviderType) },
        verificationLevel: {
          type: 'string',
          enum: Object.values(VerificationLevel),
        },
        status: { type: 'string' },
        verifiedAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No verification found for this wallet',
  })
  async getVerificationStatus(
    @Param('walletAddress') walletAddress: string,
    @Query('provider') provider?: ProviderType,
  ) {
    const status = await this.zkKycService.getVerificationStatus(
      walletAddress,
      provider,
    );

    if (!status) {
      return {
        isVerified: false,
        message: 'No verification found for this wallet',
      };
    }

    return status;
  }

  @Get('eligibility/campaign')
  @ApiOperation({
    summary: 'Check campaign eligibility',
    description: 'Check if a wallet meets the KYC requirements for a campaign',
  })
  @ApiQuery({
    name: 'walletAddress',
    description: 'Wallet address to check',
    type: 'string',
  })
  @ApiQuery({
    name: 'requiredLevel',
    description: 'Required verification level for the campaign',
    enum: VerificationLevel,
  })
  @ApiQuery({
    name: 'provider',
    description: 'Required provider (optional)',
    enum: ProviderType,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Eligibility check completed',
    schema: {
      type: 'object',
      properties: {
        isEligible: { type: 'boolean' },
        requiredLevel: { type: 'string' },
        userLevel: { type: 'string' },
        reason: { type: 'string' },
      },
    },
  })
  async checkCampaignEligibility(
    @Query('walletAddress') walletAddress: string,
    @Query('requiredLevel') requiredLevel: VerificationLevel,
    @Query('provider') provider?: ProviderType,
  ) {
    return this.zkKycService.checkCampaignEligibility(
      walletAddress,
      requiredLevel,
      provider,
    );
  }

  @Get('verifications/:walletAddress')
  @ApiOperation({
    summary: 'Get all verifications for a wallet',
    description:
      'Retrieve the complete verification history for a wallet address',
  })
  @ApiParam({
    name: 'walletAddress',
    description: 'Wallet address to get verifications for',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification history retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          provider: { type: 'string' },
          verificationLevel: { type: 'string' },
          status: { type: 'string' },
          verifiedAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getUserVerifications(@Param('walletAddress') walletAddress: string) {
    const verifications =
      await this.zkKycService.getUserVerifications(walletAddress);

    // Return sanitized data (without sensitive proof information)
    return verifications.map((v) => ({
      id: v._id,
      provider: v.provider,
      verificationLevel: v.verificationLevel,
      status: v.status,
      verifiedAt: v.verifiedAt,
      expiresAt: v.expiresAt,
      createdAt: v.createdAt,
    }));
  }

  @Get('config/world-id')
  @ApiOperation({
    summary: 'Get World ID configuration',
    description:
      'Get the configuration needed for frontend World ID integration',
  })
  @ApiQuery({
    name: 'signal',
    description: 'Optional signal to include in the verification',
    type: 'string',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'World ID configuration',
    schema: {
      type: 'object',
      properties: {
        appId: { type: 'string' },
        action: { type: 'string' },
        signal: { type: 'string' },
      },
    },
  })
  getWorldIdConfig(@Query('signal') signal?: string) {
    return this.zkKycService.generateWorldIdConfig(signal);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get verification statistics',
    description: 'Get aggregated statistics about verifications (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byProvider: { type: 'object' },
        byLevel: { type: 'object' },
        byStatus: { type: 'object' },
      },
    },
  })
  async getVerificationStats() {
    return this.zkKycService.getVerificationStats();
  }

  @Post('revoke/:verificationId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke a verification',
    description: 'Revoke a verification (admin only)',
  })
  @ApiParam({
    name: 'verificationId',
    description: 'ID of the verification to revoke',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification revoked successfully',
  })
  async revokeVerification(@Param('verificationId') verificationId: string) {
    await this.zkKycService.revokeVerification(verificationId);
    return { success: true, message: 'Verification revoked successfully' };
  }
}
