import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  /**
   * 创建商品
   */
  async create(
    userId: string,
    merchantId: string,
    createData: Partial<Product>
  ): Promise<Product> {
    const product = this.productsRepository.create({
      ...createData,
      merchantId,
      status: 'approved',
    });

    return this.productsRepository.save(product);
  }

  /**
   * 获取商品列表（简化版）
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc';
  }) {
    const {
      page = 1,
      limit = 20,
      search,
      minPrice,
      maxPrice,
      sort = 'newest',
    } = params;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    // 搜索条件
    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 价格范围筛选
    if (minPrice) {
      queryBuilder.andWhere('product.priceDomestic >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      queryBuilder.andWhere('product.priceDomestic <= :maxPrice', { maxPrice });
    }

    // 排序
    switch (sort) {
      case 'price_asc':
        queryBuilder.orderBy('product.priceDomestic', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.priceDomestic', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
    }

    // 分页
    const total = await queryBuilder.getCount();
    queryBuilder.skip((page - 1) * limit).take(limit);

    const data = await queryBuilder.getMany();

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取商品详情
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  /**
   * 更新商品
   */
  async update(
    id: string,
    userId: string,
    updateData: Partial<Product>
  ): Promise<Product> {
    const product = await this.findOne(id);

    // 检查权限（暂时跳过）
    // if (product.merchantId !== userId) {
    //   throw new ForbiddenException('只能修改自己的商品');
    // }

    await this.productsRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * 删除商品
   */
  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id);

    // 检查权限（暂时跳过）
    // if (product.merchantId !== userId) {
    //   throw new ForbiddenException('只能删除自己的商品');
    // }

    await this.productsRepository.delete(id);
  }

  /**
   * 审核商品（管理员）
   */
  async approve(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = 'approved';
    product.approvedAt = new Date();
    return this.productsRepository.save(product);
  }

  /**
   * 拒绝商品（管理员）
   */
  async reject(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = 'rejected';
    return this.productsRepository.save(product);
  }

  /**
   * 获取相似商品
   */
  async getSimilar(id: string, limit: number = 5): Promise<Product[]> {
    const product = await this.findOne(id);
    
    return this.productsRepository.find({
      where: {
        categoryId: product.categoryId,
        status: 'approved',
        id: { $ne: id },
      },
      order: { stockQty: 'DESC' },
      take: limit,
    });
  }
}
