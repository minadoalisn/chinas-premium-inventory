import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SmsService } from '../sms/sms.service';
export declare class AuthController {
    private readonly authService;
    private readonly smsService;
    constructor(authService: AuthService, smsService: SmsService);
    register(registerDto: RegisterDto): unknown;
    login(loginDto: LoginDto): unknown;
    getCurrentUser(req: any): unknown;
}
