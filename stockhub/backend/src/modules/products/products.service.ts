import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * 创建商品
   */
  async create(
    userId: string,
    merchantId: string,
    createData: Partial<Product>
  ): Promise<Product> {
    // 验证类目
    if (createData.category) {
      const category = await this.categoriesRepository.findOne({
        where: { id: createData.category.id },
      });
      if (!category) {
        throw new NotFoundException('类目不存在');
      }
    }

    const product = this.productsRepository.create({
      ...createData,
      merchantId,
      status: 'approved',
    });

    return this.productsRepository.save(product);
  }

  /**
   * 获取商品列表
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc';
    merchantId?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      merchantId,
    } = params;

    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.merchant', 'merchant');

    // 搜索条件
    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 类目筛选
    if (category) {
      queryBuilder.andWhere('category.id = :category', { category });
    }

    // 价格范围筛选
    if (minPrice) {
      queryBuilder.andWhere('product.domesticPrice >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      queryBuilder.andWhere('product.domesticPrice <= :maxPrice', { maxPrice });
    }

    // 商户筛选
    if (merchantId) {
      queryBuilder.andWhere('product.merchantId = :merchantId', { merchantId });
    }

    // 排序
    switch (sort) {
      case 'price_asc':
        queryBuilder.orderBy('product.domesticPrice', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.domesticPrice', 'DESC');
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
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'merchant'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  /**
   * 获取相似商品
   */
  async findSimilar(id: string, limit: number = 5) {
    const product = await this.findOne(id);

    const similarProducts = await this.productsRepository.find({
      where: {
        category: { id: product.category.id },
        status: 'approved',
      },
      relations: ['category'],
      order: { stockQty: 'DESC' },
      take: limit,
    }).then(products => products.filter(p => p.id !== id));

    return similarProducts;
  }

  /**
   * 更新商品
   */
  async update(
    id: string,
    userId: string,
    updateData: Partial<Product>
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 权限检查
    if (product.merchantId !== userId) {
      throw new ForbiddenException('无权修改此商品');
    }

    // 验证类目
    if (updateData.category) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateData.category.id },
      });
      if (!category) {
        throw new NotFoundException('类目不存在');
      }
    }

    Object.assign(product, updateData);
    product.updatedAt = new Date();

    return this.productsRepository.save(product);
  }

  /**
   * 删除商品
   */
  async remove(id: string, userId: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 权限检查
    if (product.merchantId !== userId) {
      throw new ForbiddenException('无权删除此商品');
    }

    await this.productsRepository.remove(product);
  }

  /**
   * 上架商品
   */
  async approve(id: string, userId: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = 'approved';
    return this.productsRepository.save(product);
  }

  /**
   * 下架商品
   */
  async reject(id: string, userId: string): Promise<Product> {
    const product = await this.findOne(id);
    product.status = 'rejected';
    return this.productsRepository.save(product);
  }
}
