import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  @ApiOperation({ summary: '获取商户列表' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: any) {
    return this.merchantsService.findAll({
      status: query.status,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商户详情' })
  async findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: '获取商户商品列表' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getProducts(@Param('id') id: string, @Query() query: any) {
    return this.merchantsService.getProducts(
      id,
      parseInt(query.page) || 1,
      parseInt(query.limit) || 20,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '申请入驻' })
  async create(@Req() req: any, @Body() data: any) {
    return this.merchantsService.create({
      ...data,
      userId: req.user.id,
      status: 'pending',
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新商户信息' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.merchantsService.update(id, updateData);
  }
}
