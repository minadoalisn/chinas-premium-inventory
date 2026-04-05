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
   * 虚拟认证模式：验证码固定为123456
   */
  async register(
    registerDto: RegisterDto,
    verifyCode: (phone: string, code: string) => Promise<boolean>
  ) {
    // 虚拟认证：验证码必须是123456
    if (registerDto.code !== '123456') {
      throw new UnauthorizedException('验证码错误（测试环境请使用：123456）');
    }

    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }

    // 创建新用户（虚拟模式：设置默认密码）
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = this.usersRepository.create({
      phone: registerDto.phone,
      password: hashedPassword,
      role: 'buyer',
      isActive: true,
    });

    await this.usersRepository.save(user);

    // 生成 JWT Token
    const token = this.jwtService.sign({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  /**
   * 登录（手机号+验证码）
   * 虚拟认证模式：验证码固定为123456
   */
  async login(
    loginDto: LoginDto,
    verifyCode: (phone: string, code: string) => Promise<boolean>
  ) {
    // 虚拟认证：验证码必须是123456
    if (loginDto.code !== '123456') {
      throw new UnauthorizedException('验证码错误（测试环境请使用：123456）');
    }

    // 查找用户
    const user = await this.usersRepository.findOne({
      where: { phone: loginDto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 生成 JWT Token
    const token = this.jwtService.sign({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  /**
   * 获取用户信息
   */
  async getUser(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
