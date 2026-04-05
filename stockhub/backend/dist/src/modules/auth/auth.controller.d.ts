import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SmsService } from '../sms/sms.service';
export declare class AuthController {
    private readonly authService;
    private readonly smsService;
    constructor(authService: AuthService, smsService: SmsService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        token: any;
        user: {
            id: any;
            phone: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        token: any;
        user: {
            id: any;
            phone: any;
            role: any;
        };
    }>;
    getCurrentUser(req: any): Promise<{
        id: any;
        phone: any;
        role: any;
        nickname: any;
        avatar: any;
        createdAt: any;
    }>;
}
