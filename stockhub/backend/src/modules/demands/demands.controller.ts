import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('求购需求')
@Controller('demands')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Post()
  @ApiOperation({ summary: '创建求购需求' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async create(@Request() req, @Body() createDemandDto: CreateDemandDto) {
    return this.demandsService.create(req.user.buyerId, createDemandDto);
  }

  @Get()
  @ApiOperation({ summary: '获取求购列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: 'newest' | 'quantity' | 'price',
  ) {
    return this.demandsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      category,
      sort,
    });
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的求购列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  getMyDemands(@Request() req) {
    return this.demandsService.findAll({
      userId: req.user.buyerId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取求购详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '求购不存在' })
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }

  @Get(':id/match')
  @ApiOperation({ summary: '匹配商品（智能推荐）' })
  @ApiResponse({ status: 200, description: '匹配成功' })
  matchProducts(@Param('id') id: string) {
    return this.demandsService.matchProducts(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新求购需求' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '求购不存在' })
  @ApiResponse({ status: 403, description: '无权修改' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDemandDto: UpdateDemandDto,
  ) {
    return this.demandsService.update(id, req.user.buyerId, updateDemandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除求购需求' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '求购不存在' })
  @ApiResponse({ status: 403, description: '无权删除' })
  remove(@Request() req, @Param('id') id: string) {
    return this.demandsService.remove(id, req.user.buyerId);
  }
}
