import { Controller, Get, Post, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * 获取所有类目
   */
  @Get()
  @ApiOperation({ summary: '获取所有类目' })
  async findAll(@Req() req: any) {
    const clientType = req.clientType || 'domestic';
    return this.categoriesService.findAll(clientType);
  }

  /**
   * 获取类目详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取类目详情' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const clientType = req.clientType || 'domestic';
    return this.categoriesService.findOne(parseInt(id), clientType);
  }

  /**
   * 根据父类目获取子类目
   */
  @Get('parent/:parentId')
  @ApiOperation({ summary: '获取子类目' })
  @ApiQuery({ name: 'parentId', required: false, description: '父类目ID，默认0' })
  async findByParent(@Req() req: any, @Param('parentId') parentId: string = '0') {
    const clientType = req.clientType || 'domestic';
    return this.categoriesService.findByParent(parseInt(parentId), clientType);
  }

  /**
   * 初始化类目数据（仅开发环境）
   */
  @Post('seed')
  @ApiOperation({ summary: '初始化类目数据' })
  async seed() {
    return this.categoriesService.seedCategories();
  }
}
