import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取询盘列表' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Req() req: any, @Query() query: any) {
    return this.inquiriesService.findAll({
      buyerId: req.user.id,
      status: query.status,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取询盘详情' })
  async findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建询盘' })
  async create(@Req() req: any, @Body() createData: any) {
    // 补充买家信息
    const data = {
      ...createData,
      buyerId: req.user.id,
    };
    return this.inquiriesService.create(data);
  }

  @Post(':id/accept-quote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '接受报价' })
  async acceptQuote(@Param('id') id: string) {
    return this.inquiriesService.acceptQuote(id);
  }
}
