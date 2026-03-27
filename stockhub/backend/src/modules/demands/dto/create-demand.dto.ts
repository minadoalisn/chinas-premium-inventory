import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateDemandDto {
  @ApiProperty({ description: '需求标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '需求描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '求购数量' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: '单位' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: '预算单价' })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiProperty({ description: '收货地址' })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ description: '是否加急' })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ description: '类目ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
