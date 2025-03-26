import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './entities/refresh-token.entity';
import {
  LoginAttempt,
  LoginAttemptDocument,
} from './entities/login-attempt.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(LoginAttempt.name)
    private loginAttemptModel: Model<LoginAttemptDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async login(
    loginDto: LoginDto,
    ipAddress: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the signature
      const isValidSignature = await this.verifySignature(
        loginDto.address,
        loginDto.signature,
      );

      if (!isValidSignature) {
        await this.recordLoginAttempt(
          loginDto.address,
          ipAddress,
          userAgent,
          false,
          'Invalid signature',
        );
        throw new UnauthorizedException('Invalid signature');
      }

      // Find or create user
      let user = await this.userModel.findOne({ address: loginDto.address });
      if (!user) {
        user = await this.userModel.create({
          address: loginDto.address,
          username: `user_${loginDto.address.slice(2, 8)}`, // Create temporary username
          reputationScore: 0,
          verifiedActions: [],
          ownedNFTs: [],
        });
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(
        user,
        ipAddress,
        userAgent,
      );

      await this.recordLoginAttempt(
        loginDto.address,
        ipAddress,
        userAgent,
        true,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await this.recordLoginAttempt(
        loginDto.address,
        ipAddress,
        userAgent,
        false,
        error.message,
      );
      throw error;
    }
  }

  async refreshToken(
    token: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenDoc = await this.refreshTokenModel
      .findOne({ token, isRevoked: false })
      .populate('user');

    if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const user = refreshTokenDoc.user as UserDocument;
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(
      user,
      ipAddress,
      userAgent,
    );

    // Revoke old refresh token
    await this.revokeRefreshToken(token);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    await this.revokeRefreshToken(token);
  }

  private async verifySignature(
    address: string,
    signature: string,
  ): Promise<boolean> {
    try {
      const message =
        this.configService.get<string>('AUTH_MESSAGE') ||
        'Sign this message to prove you own this wallet and login to the application.';

      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  private generateAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      address: user.address,
      type: 'access' as const,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });
  }

  private async generateRefreshToken(
    user: UserDocument,
    ipAddress: string,
    userAgent?: string,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      address: user.address,
      type: 'refresh' as const,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Long-lived refresh token
    });

    const refreshToken = new this.refreshTokenModel({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent,
    });

    await refreshToken.save();
    return token;
  }

  private async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.updateOne({ token }, { isRevoked: true });
  }

  private async recordLoginAttempt(
    address: string,
    ipAddress: string,
    userAgent: string | undefined,
    isSuccessful: boolean,
    failureReason?: string,
  ): Promise<void> {
    await this.loginAttemptModel.create({
      address,
      ipAddress,
      userAgent,
      isSuccessful,
      failureReason,
    });
  }
}
