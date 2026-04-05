import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('类目管理')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('initialize')
  @ApiOperation({ summary: '初始化类目数据' })
  @ApiResponse({ status: 201, description: '初始化成功' })
  async initialize() {
    await this.categoriesService.initializeCategories();
    return { message: '类目数据初始化成功' };
  }

  @Get()
  @ApiOperation({ summary: '获取所有类目' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取类目详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '类目不存在' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }
}
