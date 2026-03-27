import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  videos?: string[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @Min(0)
  stockQty: number;

  @IsNumber()
  domesticPrice: number;

  @IsNumber()
  overseasPrice: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  minOrderQty?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WholesaleTierDto)
  wholesaleTiers?: WholesaleTierDto[];

  @IsNumber()
  @IsOptional()
  displayDomestic?: boolean;

  @IsNumber()
  @IsOptional()
  displayOverseas?: boolean;

  @IsString()
  @IsOptional()
  specifications?: string;
}

export class WholesaleTierDto {
  @IsNumber()
  minQty: number;

  @IsNumber()
  unitPrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  savings?: string;
}
