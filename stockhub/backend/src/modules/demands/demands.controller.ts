import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DemandsService } from './demands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('demands')
@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Get()
  @ApiOperation({ summary: '获取求购需求列表' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Req() req: any, @Query() query: any) {
    const clientType = req.clientType || 'domestic';
    return this.demandsService.findAll({
      clientType,
      category: query.category,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
      status: query.status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取求购需求详情' })
  async findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }

  @Get(':id/match')
  @ApiOperation({ summary: '获取匹配商品' })
  async matchProducts(@Param('id') id: string) {
    return this.demandsService.matchProducts(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建求购需求' })
  async create(@Req() req: any, @Body() createData: any) {
    return this.demandsService.create(createData, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新求购需求' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.demandsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除求购需求' })
  async remove(@Param('id') id: string) {
    return this.demandsService.delete(id);
  }
}
