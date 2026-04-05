import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '手机号' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({ description: '短信验证码' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: '验证码必须是6位数字' })
  code: string;
}
