import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDemandDto {
  @ApiProperty({ description: '需求标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '需求描述' })
  @IsString()
  @IsOptional()
  demandDesc?: string;

  @ApiProperty({ description: '最小数量' })
  @IsNumber()
  @IsNotEmpty()
  minQty: number;

  @ApiProperty({ description: '最高价格' })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ description: '收货地址' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: '类目ID' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
