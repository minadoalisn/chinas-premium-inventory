import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(params: {
    clientType: 'domestic' | 'overseas';
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) {
    const {
      clientType,
      category,
      page = 1,
      limit = 20,
      search,
      sort = 'newest',
      minPrice,
      maxPrice,
      status = 'approved',
    } = params;

    // 构建查询条件
    const where: any = {
      status,
      stockQty: MoreThanOrEqual(0),
    };

    // 根据客户端类型控制可见性
    if (clientType === 'domestic') {
      where.displayDomestic = true;
    } else {
      where.displayOverseas = true;
    }

    // 类目筛选
    if (category) {
      where.categoryId = parseInt(category);
    }

    // 搜索筛选
    if (search) {
      if (clientType === 'domestic') {
        where.title = Like(`%${search}%`);
      } else {
        where.titleEn = Like(`%${search}%`);
      }
    }

    // 价格筛选
    if (minPrice || maxPrice) {
      const priceField = clientType === 'domestic' ? 'domesticPrice' : 'overseasPrice';
      if (minPrice) where[priceField] = MoreThanOrEqual(minPrice);
      if (maxPrice) {
        const existing = where[priceField];
        where[priceField] = existing 
          ? { ...existing, ...LessThanOrEqual(maxPrice) } 
          : LessThanOrEqual(maxPrice);
      }
    }

    // 排序逻辑
    let order: any = { createdAt: 'DESC' };
    switch (sort) {
      case 'price_asc':
        const priceFieldAsc = clientType === 'domestic' ? 'domesticPrice' : 'overseasPrice';
        order = { [priceFieldAsc]: 'ASC' };
        break;
      case 'price_desc':
        const priceFieldDesc = clientType === 'domestic' ? 'domesticPrice' : 'overseasPrice';
        order = { [priceFieldDesc]: 'DESC' };
        break;
      case 'stock_desc':
        order = { stockQty: 'DESC' };
        break;
    }

    // 查询数据
    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'merchant'],
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    // 格式化返回数据
    const formattedProducts = products.map((product) => this.formatProduct(product, clientType));

    return {
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, clientType: 'domestic' | 'overseas') {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'merchant'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 检查可见性
    if (clientType === 'domestic' && !product.displayDomestic) {
      throw new NotFoundException('Product not available for domestic users');
    }
    if (clientType === 'overseas' && !product.displayOverseas) {
      throw new NotFoundException('Product not available for overseas users');
    }

    // 增加浏览次数
    await this.productRepository.increment({ id }, 'viewCount', 1);

    return {
      success: true,
      data: this.formatProduct(product, clientType, true),
    };
  }

  async findSimilar(id: string, limit: number = 4) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const similarProducts = await this.productRepository.find({
      where: {
        categoryId: product.categoryId,
        id: Not(id),
        status: 'approved',
        displayOverseas: true,
      },
      relations: ['category'],
      take: limit,
      order: { viewCount: 'DESC' },
    });

    return {
      success: true,
      data: similarProducts.map((p) => this.formatProduct(p, 'overseas')),
    };
  }

  async create(createProductDto: CreateProductDto, merchantId: string) {
    const product = this.productRepository.create({
      ...createProductDto,
      merchantId,
    });
    return await this.productRepository.save(product);
  }

  async update(id: string, updateData: Partial<Product>) {
    await this.productRepository.update({ id }, updateData);
    return await this.findOne(id, 'domestic');
  }

  async delete(id: string) {
    await this.productRepository.delete({ id });
    return { success: true };
  }

  // 格式化商品数据
  private formatProduct(product: Product, clientType: 'domestic' | 'overseas', detailed: boolean = false) {
    const base = {
      id: product.id,
      title: clientType === 'domestic' ? product.title : product.titleEn,
      description: clientType === 'domestic' ? product.description : product.descriptionEn,
      slug: product.slug,
      price: clientType === 'domestic' ? product.domesticPrice : product.overseasPrice,
      currency: clientType === 'domestic' ? 'CNY' : 'USD',
      stockQty: product.stockQty,
      minOrderQty: clientType === 'domestic' ? 1 : product.minOrderQty,
      images: product.images,
      isExpired: product.isExpired,
      expireDate: product.expireDate,
      category: {
        id: product.category?.id,
        name: clientType === 'domestic' ? product.category?.name : product.category?.nameEn,
        iconUrl: product.category?.iconUrl,
      },
      createdAt: product.createdAt,
    };

    if (detailed) {
      return {
        ...base,
        videos: product.videos,
        specifications: product.specifications,
        wholesaleTiers: product.wholesaleTiers,
        merchant: {
          id: product.merchant?.id,
          companyName: product.merchant?.companyName,
          rating: product.merchant?.rating,
          verified: product.merchant?.status === 'approved',
          completedOrders: product.merchant?.completedOrders,
          responseTime: product.merchant?.responseTime,
        },
        viewCount: product.viewCount,
        soldCount: product.soldCount,
        inquiryCount: product.inquiryCount,
      };
    }

    return base;
  }
}

// 使用 TypeORM 的 Not 操作符
import { Not } from 'typeorm';
