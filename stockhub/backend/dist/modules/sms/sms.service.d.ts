import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private configService;
    private readonly username;
    private readonly password;
    private readonly sign;
    private verificationCodes;
    constructor(configService: ConfigService);
    generateCode(): string;
    sendVerificationCode(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyCode(phone: string, code: string): Promise<boolean>;
    cleanExpiredCodes(): void;
}
