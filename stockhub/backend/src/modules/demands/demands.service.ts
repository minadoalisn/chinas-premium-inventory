import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Demand } from './entities/demand.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class DemandsService {
  constructor(
    @InjectRepository(Demand)
    private demandsRepository: Repository<Demand>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * 创建求购需求
   */
  async create(
    userId: string,
    createData: Partial<Demand>
  ): Promise<Demand> {
    // 验证类目
    if (createData.category) {
      const category = await this.categoriesRepository.findOne({
        where: { id: createData.category.id },
      });
      if (!category) {
        throw new NotFoundException('类目不存在');
      }
    }

    const demand = this.demandsRepository.create({
      ...createData,
      userId,
      status: 'pending',
    });

    return this.demandsRepository.save(demand);
  }

  /**
   * 获取求购列表
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: 'newest' | 'quantity' | 'price';
    userId?: string;
  }) {
    const { page = 1, limit = 20, search, category, sort = 'newest', userId } = params;

    const queryBuilder = this.demandsRepository.createQueryBuilder('demand')
      .leftJoinAndSelect('demand.category', 'category')
      .leftJoinAndSelect('demand.user', 'user');

    // 搜索条件
    if (search) {
      queryBuilder.andWhere(
        '(demand.title LIKE :search OR demand.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 类目筛选
    if (category) {
      queryBuilder.andWhere('category.id = :category', { category });
    }

    // 用户筛选（我的求购）
    if (userId) {
      queryBuilder.andWhere('demand.userId = :userId', { userId });
    }

    // 排序
    switch (sort) {
      case 'quantity':
        queryBuilder.orderBy('demand.quantity', 'DESC');
        break;
      case 'price':
        queryBuilder.orderBy('demand.budget', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('demand.createdAt', 'DESC');
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
   * 获取单个求购
   */
  async findOne(id: string): Promise<Demand> {
    const demand = await this.demandsRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    if (!demand) {
      throw new NotFoundException('求购需求不存在');
    }

    return demand;
  }

  /**
   * 更新求购
   */
  async update(
    id: string,
    userId: string,
    updateData: Partial<Demand>
  ): Promise<Demand> {
    const demand = await this.demandsRepository.findOne({
      where: { id },
    });

    if (!demand) {
      throw new NotFoundException('求购需求不存在');
    }

    // 权限检查
    if (demand.userId !== userId) {
      throw new ForbiddenException('无权修改此求购');
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

    Object.assign(demand, updateData);
    demand.updatedAt = new Date();

    return this.demandsRepository.save(demand);
  }

  /**
   * 删除求购
   */
  async remove(id: string, userId: string): Promise<void> {
    const demand = await this.demandsRepository.findOne({
      where: { id },
    });

    if (!demand) {
      throw new NotFoundException('求购需求不存在');
    }

    // 权限检查
    if (demand.userId !== userId) {
      throw new ForbiddenException('无权删除此求购');
    }

    await this.demandsRepository.remove(demand);
  }

  /**
   * 匹配商品（根据求购需求匹配库存商品）
   */
  async matchProducts(id: string) {
    const demand = await this.findOne(id);

    // 简单匹配逻辑：匹配类目和价格范围
    const { category, budget, quantity } = demand;

    const queryBuilder = this.demandsRepository
      .createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId: category.id })
      .andWhere('product.stockQty >= :minQuantity', { minQuantity: quantity })
      .andWhere('product.status = :status', { status: 'approved' });

    // 如果有预算，按预算筛选
    if (budget) {
      queryBuilder.andWhere('product.domesticPrice <= :budget', { budget });
    }

    queryBuilder.orderBy('product.stockQty', 'DESC').limit(20);

    const products = await queryBuilder.getMany();

    return {
      demand,
      matchedProducts: products,
      total: products.length,
    };
  }
}
