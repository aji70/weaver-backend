import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, ipAddress: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(authHeader: string, ipAddress: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(authHeader: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
