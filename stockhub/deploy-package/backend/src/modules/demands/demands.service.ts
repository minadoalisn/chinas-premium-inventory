import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Demand } from './entities/demand.entity';

@Injectable()
export class DemandsService {
  constructor(
    @InjectRepository(Demand)
    private demandsRepository: Repository<Demand>,
  ) {}

  /**
   * 创建求购需求
   */
  async create(
    userId: string,
    createData: Partial<Demand>
  ): Promise<Demand> {
    const demand = this.demandsRepository.create({
      ...createData,
      buyerId: userId,
      status: 'open',
      matchedCount: 0,
    });

    return this.demandsRepository.save(demand);
  }

  /**
   * 获取求购列表（简化版）
   */
  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: string;
  }) {
    const { page = 1, limit = 20, userId } = params;

    const queryBuilder = this.demandsRepository.createQueryBuilder('demand');

    // 按用户筛选
    if (userId) {
      queryBuilder.andWhere('demand.buyerId = :userId', { userId });
    }

    // 分页
    queryBuilder.skip((page - 1) * limit).take(limit);

    // 按创建时间倒序
    queryBuilder.orderBy('demand.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取求购详情
   */
  async findOne(id: string): Promise<Demand> {
    const demand = await this.demandsRepository.findOne({ where: { id } });
    if (!demand) {
      throw new NotFoundException('求购不存在');
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
    const demand = await this.findOne(id);

    // 检查权限
    if (demand.buyerId !== userId) {
      throw new ForbiddenException('只能修改自己的求购');
    }

    await this.demandsRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * 删除求购
   */
  async remove(id: string, userId: string): Promise<void> {
    const demand = await this.findOne(id);

    // 检查权限
    if (demand.buyerId !== userId) {
      throw new ForbiddenException('只能删除自己的求购');
    }

    await this.demandsRepository.delete(id);
  }

  /**
   * 获取我的求购
   */
  async getMyDemands(userId: string) {
    return this.findAll({ userId });
  }
}
