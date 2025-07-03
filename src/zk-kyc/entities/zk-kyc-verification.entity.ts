import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ZkKycVerificationDocument = ZkKycVerification & Document;

export enum ProviderType {
  WORLD_ID = 'world_id',
  PRIVADO_ID = 'privado_id',
  HYPERSIGN = 'hypersign',
}

export enum VerificationLevel {
  BASIC = 'basic',
  DEVICE = 'device',
  ORB = 'orb',
  FULL_KYC = 'full_kyc',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class ZkKycVerification {
  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({
    type: String,
    enum: ProviderType,
    required: true,
  })
  provider: ProviderType;

  @Prop({
    type: String,
    enum: VerificationLevel,
    required: true,
  })
  verificationLevel: VerificationLevel;

  @Prop({
    type: String,
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Prop({ unique: true, sparse: true })
  nullifierHash?: string;

  @Prop()
  merkleRoot?: string;

  @Prop()
  proof?: string;

  @Prop()
  appId?: string;

  @Prop()
  action?: string;

  @Prop()
  signal?: string;

  @Prop()
  verifiedAt?: Date;

  @Prop()
  expiresAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  // Instance methods
  isValidForUse(): boolean {
    return (
      this.status === VerificationStatus.VERIFIED &&
      (!this.expiresAt || this.expiresAt > new Date())
    );
  }

  isExpired(): boolean {
    return this.expiresAt ? this.expiresAt <= new Date() : false;
  }

  getDaysUntilExpiry(): number | null {
    if (!this.expiresAt) return null;
    const now = new Date();
    const diffTime = this.expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const ZkKycVerificationSchema =
  SchemaFactory.createForClass(ZkKycVerification);

// Add indexes
ZkKycVerificationSchema.index({ walletAddress: 1, provider: 1 });
ZkKycVerificationSchema.index(
  { nullifierHash: 1 },
  { unique: true, sparse: true },
);
ZkKycVerificationSchema.index({ status: 1 });
ZkKycVerificationSchema.index({ expiresAt: 1 });
