import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly username: string;
  private readonly password: string;
  private readonly sign: string;
  
  // 验证码存储（5分钟过期）
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();
  
  constructor(private configService: ConfigService) {
    this.username = this.configService.get('SMSBAO_USERNAME');
    this.password = this.configService.get('SMSBAO_PASSWORD');
    this.sign = this.configService.get('SMSBAO_SIGN', '【库存易】');
  }

  /**
   * 生成6位验证码
   */
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 发送短信验证码
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // 检查手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        throw new BadRequestException('手机号格式不正确');
      }

      // 检查是否频繁发送（1分钟内只能发送一次）
      const lastCode = this.verificationCodes.get(phone);
      if (lastCode && lastCode.expiresAt > Date.now() + 240000) {
        throw new BadRequestException('验证码发送过于频繁，请1分钟后再试');
      }

      // 生成新验证码
      const code = this.generateCode();
      const expiresAt = Date.now() + 300000; // 5分钟后过期

      // 构造短信内容
      const content = `${this.sign}您的验证码是${code}，5分钟内有效。`;

      // 调用短信宝 API
      const url = 'http://api.smsbao.com/sms';
      const params = new URLSearchParams({
        u: this.username,
        p: this.password,
        m: phone,
        c: content,
      });

      const response = await axios.get(`${url}?${params}`, {
        timeout: 10000,
      });

      const result = response.data.toString().trim();
      
      // 短信宝返回状态码：0表示成功
      if (result === '0') {
        // 存储验证码
        this.verificationCodes.set(phone, { code, expiresAt });
        
        return {
          success: true,
          message: '验证码已发送',
        };
      } else {
        const errorMessages: Record<string, string> = {
          '30': '密码错误',
          '40': '账号不存在',
          '41': '余额不足',
          '42': '账号过期',
          '43': 'IP地址限制',
          '50': '内容含有敏感词',
          '51': '手机号码不正确',
        };
        
        throw new BadRequestException(
          errorMessages[result] || `短信发送失败: ${result}`
        );
      }
    } catch (error) {
      console.error('发送短信失败:', error);
      throw new BadRequestException('短信发送失败，请稍后重试');
    }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const storedData = this.verificationCodes.get(phone);
    
    if (!storedData) {
      return false;
    }

    // 检查是否过期
    if (Date.now() > storedData.expiresAt) {
      this.verificationCodes.delete(phone);
      return false;
    }

    // 验证码比对
    const isValid = storedData.code === code;
    
    // 验证成功后删除验证码（一次性使用）
    if (isValid) {
      this.verificationCodes.delete(phone);
    }

    return isValid;
  }

  /**
   * 清理过期的验证码（定时任务）
   */
  cleanExpiredCodes(): void {
    const now = Date.now();
    for (const [phone, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(phone);
      }
    }
  }
}
