"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const user_entity_1 = require("../users/entities/user.entity");
const ethers_1 = require("ethers");
let AuthService = class AuthService {
    jwtService;
    configService;
    refreshTokenModel;
    loginAttemptModel;
    userModel;
    constructor(jwtService, configService, refreshTokenModel, loginAttemptModel, userModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.refreshTokenModel = refreshTokenModel;
        this.loginAttemptModel = loginAttemptModel;
        this.userModel = userModel;
    }
    async login(loginDto, ipAddress, userAgent) {
        try {
            const isValidSignature = await this.verifySignature(loginDto.address, loginDto.signature);
            if (!isValidSignature) {
                await this.recordLoginAttempt(loginDto.address, ipAddress, userAgent, false, 'Invalid signature');
                throw new common_1.UnauthorizedException('Invalid signature');
            }
            let user = await this.userModel.findOne({ address: loginDto.address });
            if (!user) {
                user = await this.userModel.create({
                    address: loginDto.address,
                    username: `user_${loginDto.address.slice(2, 8)}`,
                    reputationScore: 0,
                    verifiedActions: [],
                    ownedNFTs: [],
                });
            }
            const accessToken = this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user, ipAddress, userAgent);
            await this.recordLoginAttempt(loginDto.address, ipAddress, userAgent, true);
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            await this.recordLoginAttempt(loginDto.address, ipAddress, userAgent, false, error.message);
            throw error;
        }
    }
    async refreshToken(token, ipAddress, userAgent) {
        const refreshTokenDoc = await this.refreshTokenModel
            .findOne({ token, isRevoked: false })
            .populate('user');
        if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = refreshTokenDoc.user;
        const accessToken = this.generateAccessToken(user);
        const newRefreshToken = await this.generateRefreshToken(user, ipAddress, userAgent);
        await this.revokeRefreshToken(token);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(token) {
        await this.revokeRefreshToken(token);
    }
    async verifySignature(address, signature) {
        try {
            const message = this.configService.get('AUTH_MESSAGE') ||
                'Sign this message to prove you own this wallet and login to the application.';
            const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === address.toLowerCase();
        }
        catch {
            return false;
        }
    }
    generateAccessToken(user) {
        const payload = {
            sub: user._id.toString(),
            address: user.address,
            type: 'access',
        };
        return this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
    }
    async generateRefreshToken(user, ipAddress, userAgent) {
        const payload = {
            sub: user._id.toString(),
            address: user.address,
            type: 'refresh',
        };
        const token = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        const refreshToken = new this.refreshTokenModel({
            user: user._id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ipAddress,
            userAgent,
        });
        await refreshToken.save();
        return token;
    }
    async revokeRefreshToken(token) {
        await this.refreshTokenModel.updateOne({ token }, { isRevoked: true });
    }
    async recordLoginAttempt(address, ipAddress, userAgent, isSuccessful, failureReason) {
        await this.loginAttemptModel.create({
            address,
            ipAddress,
            userAgent,
            isSuccessful,
            failureReason,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(refresh_token_entity_1.RefreshToken.name)),
    __param(3, (0, mongoose_1.InjectModel)(login_attempt_entity_1.LoginAttempt.name)),
    __param(4, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map