import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 注册（手机号+验证码）
   */
  async register(
    registerDto: RegisterDto,
    verifyCode: (phone: string, code: string) => Promise<boolean>
  ) {
    // 验证验证码
    const isValid = await verifyCode(registerDto.phone, registerDto.code);
    if (!isValid) {
      throw new UnauthorizedException('验证码错误或已过期');
    }

    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }

    // 创建新用户
    const user = this.usersRepository.create({
      phone: registerDto.phone,
      role: 'buyer',
      isActive: true,
    });

    await this.usersRepository.save(user);

    // 生成 JWT Token
    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * 登录（手机号+验证码）
   */
  async login(
    loginDto: LoginDto,
    verifyCode: (phone: string, code: string) => Promise<boolean>
  ) {
    // 验证验证码
    const isValid = await verifyCode(loginDto.phone, loginDto.code);
    if (!isValid) {
      throw new UnauthorizedException('验证码错误或已过期');
    }

    // 查找用户
    const user = await this.usersRepository.findOne({
      where: { phone: loginDto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 生成 JWT Token
    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * 获取当前用户信息
   */
  async getUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      merchantId: user.merchantId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
