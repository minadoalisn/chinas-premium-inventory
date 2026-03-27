import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * 获取商品列表（根据客户端类型自动过滤）
   */
  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiQuery({ name: 'category', required: false, description: '类目ID' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'price_asc', 'price_desc', 'stock_desc'] })
  @ApiQuery({ name: 'minPrice', required: false, description: '最低价格' })
  @ApiQuery({ name: 'maxPrice', required: false, description: '最高价格' })
  async findAll(@Req() req: any, @Query() query: any) {
    const clientType = req.clientType || 'domestic';
    return this.productsService.findAll({
      clientType,
      category: query.category,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
      search: query.search,
      sort: query.sort,
      minPrice: parseFloat(query.minPrice),
      maxPrice: parseFloat(query.maxPrice),
    });
  }

  /**
   * 获取商品详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const clientType = req.clientType || 'domestic';
    return this.productsService.findOne(id, clientType);
  }

  /**
   * 获取相似商品
   */
  @Get(':id/similar')
  @ApiOperation({ summary: '获取相似商品' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量', example: 4 })
  async findSimilar(@Param('id') id: string, @Query('limit') limit: number = 4) {
    return this.productsService.findSimilar(id, limit);
  }

  /**
   * 创建商品（需要商户认证）
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建商品' })
  async create(@Req() req: any, @Body() createProductDto: CreateProductDto) {
    // 从JWT获取商户ID
    const merchantId = req.user.merchantId;
    return this.productsService.create(createProductDto, merchantId);
  }

  /**
   * 更新商品
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新商品' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.productsService.update(id, updateData);
  }

  /**
   * 删除商品
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除商品' })
  async remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
