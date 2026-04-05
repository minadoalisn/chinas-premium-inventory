import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Request() req, @Body() createProductDto: any) {
    const userId = req.user?.userId || req.user?.sub || '1';
    const merchantId = req.user?.merchantId || userId;
    return this.productsService.create(userId, merchantId, createProductDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: 'newest' | 'price_asc' | 'price_desc',
  ) {
    const merchantId = req.user?.merchantId || null;
    return this.productsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sort,
      merchantId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/similar')
  getSimilar(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getSimilar(id, limit ? parseInt(limit) : 5);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateProductDto: any) {
    const userId = req.user?.userId || req.user?.sub || '1';
    return this.productsService.update(id, userId, updateProductDto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub || '1';
    this.productsService.remove(id, userId);
    return { success: true, message: '删除成功' };
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.productsService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.productsService.reject(id);
  }
}
