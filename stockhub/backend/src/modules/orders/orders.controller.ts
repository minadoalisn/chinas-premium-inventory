import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Req() req: any, @Query() query: any) {
    return this.ordersService.findAll({
      buyerId: req.user.id,
      status: query.status,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取订单详情' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建订单' })
  async create(@Req() req: any, @Body() createData: any) {
    return this.ordersService.create({
      ...createData,
      buyerId: req.user.id,
    });
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消订单' })
  async cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.ordersService.cancel(id, body.reason);
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新订单状态' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
