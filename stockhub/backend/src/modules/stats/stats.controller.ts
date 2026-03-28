import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('数据统计')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取平台总览' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getPlatformOverview() {
    return this.statsService.getPlatformOverview();
  }

  @Get('user')
  @ApiOperation({ summary: '获取用户统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserStats(@Request() req) {
    return this.statsService.getUserStats(req.user.userId);
  }

  @Get('demands')
  @ApiOperation({ summary: '获取求购统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getDemandStats(@Query('userId') userId?: string) {
    return this.statsService.getDemandStats(userId);
  }

  @Get('products')
  @ApiOperation({ summary: '获取商品统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProductStats(@Query('merchantId') merchantId?: string) {
    return this.statsService.getProductStats(merchantId);
  }

  @Get('orders')
  @ApiOperation({ summary: '获取订单统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getOrderStats(@Query('userId') userId?: string) {
    return this.statsService.getOrderStats(userId);
  }

  @Get('inquiries')
  @ApiOperation({ summary: '获取询盘统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getInquiryStats(@Query('userId') userId?: string) {
    return this.statsService.getInquiryStats(userId);
  }

  @Get('recent')
  @ApiOperation({ summary: '获取近期数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getRecentData(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 30;
    return this.statsService.getRecentData(daysNum);
  }

  @Get('categories/top')
  @ApiOperation({ summary: '获取热门类目' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getTopCategories(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.statsService.getTopCategories(limitNum);
  }
}
