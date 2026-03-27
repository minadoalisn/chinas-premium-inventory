import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SmsService } from '../sms/sms.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册（手机号+验证码）' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 409, description: '手机号已注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, (phone, code) =>
      this.smsService.verifyCode(phone, code)
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录（手机号+验证码）' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '验证码错误或用户不存在' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, (phone, code) =>
      this.smsService.verifyCode(phone, code)
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getCurrentUser(@Request() req) {
    return this.authService.getUser(req.user.userId);
  }
}
