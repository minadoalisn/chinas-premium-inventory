import { SmsService } from './sms.service';
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendCode(body: {
        phone: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
