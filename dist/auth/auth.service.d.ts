import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDocument } from './entities/refresh-token.entity';
import { LoginAttemptDocument } from './entities/login-attempt.entity';
import { UserDocument } from '../users/entities/user.entity';
export declare class AuthService {
    private jwtService;
    private configService;
    private refreshTokenModel;
    private loginAttemptModel;
    private userModel;
    constructor(jwtService: JwtService, configService: ConfigService, refreshTokenModel: Model<RefreshTokenDocument>, loginAttemptModel: Model<LoginAttemptDocument>, userModel: Model<UserDocument>);
    login(loginDto: LoginDto, ipAddress: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(token: string, ipAddress: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<void>;
    private verifySignature;
    private generateAccessToken;
    private generateRefreshToken;
    private revokeRefreshToken;
    private recordLoginAttempt;
}
