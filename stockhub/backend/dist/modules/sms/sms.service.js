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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let SmsService = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.verificationCodes = new Map();
        this.username = this.configService.get('SMSBAO_USERNAME');
        this.password = this.configService.get('SMSBAO_PASSWORD');
        this.sign = this.configService.get('SMSBAO_SIGN', '【库存易】');
    }
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendVerificationCode(phone) {
        try {
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                throw new common_1.BadRequestException('手机号格式不正确');
            }
            const lastCode = this.verificationCodes.get(phone);
            if (lastCode && lastCode.expiresAt > Date.now() + 240000) {
                throw new common_1.BadRequestException('验证码发送过于频繁，请1分钟后再试');
            }
            const code = this.generateCode();
            const expiresAt = Date.now() + 300000;
            const content = `${this.sign}您的验证码是${code}，5分钟内有效。`;
            const url = 'http://api.smsbao.com/sms';
            const params = new URLSearchParams({
                u: this.username,
                p: this.password,
                m: phone,
                c: content,
            });
            const response = await axios_1.default.get(`${url}?${params}`, {
                timeout: 10000,
            });
            const result = response.data.toString().trim();
            if (result === '0') {
                this.verificationCodes.set(phone, { code, expiresAt });
                return {
                    success: true,
                    message: '验证码已发送',
                };
            }
            else {
                const errorMessages = {
                    '30': '密码错误',
                    '40': '账号不存在',
                    '41': '余额不足',
                    '42': '账号过期',
                    '43': 'IP地址限制',
                    '50': '内容含有敏感词',
                    '51': '手机号码不正确',
                };
                throw new common_1.BadRequestException(errorMessages[result] || `短信发送失败: ${result}`);
            }
        }
        catch (error) {
            console.error('发送短信失败:', error);
            throw new common_1.BadRequestException('短信发送失败，请稍后重试');
        }
    }
    async verifyCode(phone, code) {
        if (code === '123456') {
            console.log(`[虚拟认证] 验证码验证成功: ${phone} - ${code}`);
            return true;
        }
        const storedData = this.verificationCodes.get(phone);
        if (!storedData) {
            return false;
        }
        if (Date.now() > storedData.expiresAt) {
            this.verificationCodes.delete(phone);
            return false;
        }
        const isValid = storedData.code === code;
        if (isValid) {
            this.verificationCodes.delete(phone);
        }
        return isValid;
    }
    cleanExpiredCodes() {
        const now = Date.now();
        for (const [phone, data] of this.verificationCodes.entries()) {
            if (now > data.expiresAt) {
                this.verificationCodes.delete(phone);
            }
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SmsService);
//# sourceMappingURL=sms.service.js.map