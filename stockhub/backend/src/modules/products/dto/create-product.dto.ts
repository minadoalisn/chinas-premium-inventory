import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: '商品标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '商品描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '类目ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: '库存数量' })
  @IsNumber()
  @IsNotEmpty()
  stockQty: number;

  @ApiProperty({ description: '国内价格（元）' })
  @IsNumber()
  @IsNotEmpty()
  domesticPrice: number;

  @ApiProperty({ description: '海外价格（美元）' })
  @IsNumber()
  @IsOptional()
  overseasPrice?: number;

  @ApiProperty({ description: '是否临期' })
  @IsBoolean()
  @IsOptional()
  isExpired?: boolean;

  @ApiProperty({ description: '到期日期' })
  @IsString()
  @IsOptional()
  expireDate?: string;

  @ApiProperty({ description: '商品图片URL列表' })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: '规格参数' })
  @IsOptional()
  specifications?: Record<string, any>;
}
