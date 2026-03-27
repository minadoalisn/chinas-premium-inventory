import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Demand } from './entities/demand.entity';

@Injectable()
export class DemandsService {
  constructor(
    @InjectRepository(Demand)
    private readonly demandRepository: Repository<Demand>,
  ) {}

  async findAll(params: {
    clientType: 'domestic' | 'overseas';
    category?: string;
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const { category, page = 1, limit = 20, status = 'open' } = params;

    const where: any = { status };

    if (category) {
      where.categoryId = parseInt(category);
    }

    const [demands, total] = await this.demandRepository.findAndCount({
      where,
      relations: ['category', 'buyer'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: demands.map((d) => this.formatDemand(d)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const demand = await this.demandRepository.findOne({
      where: { id },
      relations: ['category', 'buyer'],
    });

    if (!demand) {
      throw new NotFoundException('Demand not found');
    }

    return {
      success: true,
      data: this.formatDemand(demand, true),
    };
  }

  async create(createData: Partial<Demand>, buyerId: string) {
    const demand = this.demandRepository.create({
      ...createData,
      buyerId,
    });
    return await this.demandRepository.save(demand);
  }

  async update(id: string, updateData: Partial<Demand>) {
    await this.demandRepository.update({ id }, updateData);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.demandRepository.delete({ id });
    return { success: true };
  }

  // 智能匹配商品
  async matchProducts(demandId: string) {
    const demand = await this.findOne(demandId);
    if (!demand.success) {
      throw new NotFoundException('Demand not found');
    }

    // TODO: 实现匹配算法
    // 1. 查询同类目商品
    // 2. 过滤符合条件商品（库存 >= 求购数量，价格 <= 预算）
    // 3. 计算匹配分数
    // 4. 返回TOP20

    return {
      success: true,
      data: [],
      matchedCount: 0,
    };
  }

  private formatDemand(demand: Demand, detailed = false) {
    const base = {
      id: demand.id,
      categoryId: demand.categoryId,
      categoryName: demand.category?.name,
      minQty: demand.minQty,
      maxPrice: demand.maxPrice,
      demandDesc: demand.demandDesc,
      location: demand.location,
      status: demand.status,
      tags: demand.tags,
      matchedCount: demand.matchedCount,
      createdAt: demand.createdAt,
    };

    if (detailed) {
      return {
        ...base,
        buyer: {
          name: demand.buyer?.name,
        },
      };
    }

    return base;
  }
}
