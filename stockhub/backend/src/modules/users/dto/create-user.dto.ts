import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '13800138000' })
  @IsString()
  @MinLength(11)
  phone: string;

  @ApiProperty({ example: '张三' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'buyer', enum: ['buyer', 'merchant', 'admin'] })
  @IsOptional()
  @IsString()
  role?: 'buyer' | 'merchant' | 'admin';
}
