import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Demand } from '../demands/entities/demand.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Demand)
    private demandsRepository: Repository<Demand>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Inquiry)
    private inquiriesRepository: Repository<Inquiry>,
  ) {}

  /**
   * 获取用户统计
   */
  async getUserStats(userId: string) {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { isActive: true } });

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
    };
  }

  /**
   * 获取求购统计
   */
  async getDemandStats(userId?: string) {
    const total = await this.demandsRepository.count();
    const pending = await this.demandsRepository.count({ where: { status: 'pending' } });
    const matched = await this.demandsRepository.query(
      `SELECT COUNT(*) as count FROM demands WHERE status = 'matched'`
    );
    const completed = await this.demandsRepository.count({ where: { status: 'completed' } });

    // 如果指定了用户，获取用户的求购统计
    if (userId) {
      const userTotal = await this.demandsRepository.count({ where: { userId } });
      const userPending = await this.demandsRepository.count({
        where: { userId, status: 'pending' },
      });
      const userMatched = await this.demandsRepository.query(
        `SELECT COUNT(*) as count FROM demands WHERE userId = ? AND status = 'matched'`,
        [userId]
      );

      return {
        total: userTotal,
        pending: userPending,
        matched: userMatched,
        completed: 0,
      };
    }

    return {
      total,
      pending,
      matched,
      completed,
      closed: total - pending - matched - completed,
    };
  }

  /**
   * 获取商品统计
   */
  async getProductStats(merchantId?: string) {
    const total = await this.productsRepository.count();
    const approved = await this.productsRepository.count({ where: { status: 'approved' } });
    const pending = await this.productsRepository.count({ where: { status: 'pending' } });
    const outOfStock = await this.productsRepository.query(
      `SELECT COUNT(*) as count FROM products WHERE stockQty <= 0`
    );

    // 如果指定了商户，获取商户的商品统计
    if (merchantId) {
      const merchantTotal = await this.productsRepository.count({
        where: { merchantId },
      });
      const merchantApproved = await this.productsRepository.count({
        where: { merchantId, status: 'approved' },
      });

      return {
        total: merchantTotal,
        approved: merchantApproved,
        pending: 0,
        outOfStock: 0,
      };
    }

    return {
      total,
      approved,
      pending,
      outOfStock,
      rejected: total - approved - pending,
    };
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(userId?: string) {
    const total = await this.ordersRepository.count();
    const pending = await this.ordersRepository.count({
      where: { status: 'pending' },
    });
    const completed = await this.ordersRepository.count({
      where: { status: 'completed' },
    });
    const cancelled = await this.ordersRepository.count({
      where: { status: 'cancelled' },
    });

    // 如果指定了用户，获取用户的订单统计
    if (userId) {
      const userTotal = await this.ordersRepository.count({ where: { userId } });
      const userPending = await this.ordersRepository.count({
        where: { userId, status: 'pending' },
      });
      const userCompleted = await this.ordersRepository.count({
        where: { userId, status: 'completed' },
      });

      return {
        total: userTotal,
        pending: userPending,
        completed: userCompleted,
        cancelled: 0,
      };
    }

    return {
      total,
      pending,
      completed,
      cancelled: total - pending - completed,
      rejected: 0,
    };
  }

  /**
   * 获取询盘统计
   */
  async getInquiryStats(userId?: string) {
    const total = await this.inquiriesRepository.count();
    const pending = await this.inquiriesRepository.count({
      where: { status: 'pending' },
    });
    const replied = await this.inquiriesRepository.count({
      where: { status: 'replied' },
    });

    // 如果指定了用户，获取用户的询盘统计
    if (userId) {
      const userTotal = await this.inquiriesRepository.count({ where: { userId } });
      const userPending = await this.inquiriesRepository.count({
        where: { userId, status: 'pending' },
      });
      const userReplied = await this.inquiriesRepository.count({
        where: { userId, status: 'replied' },
      });

      return {
        total: userTotal,
        pending: userPending,
        replied: userReplied,
        closed: 0,
      };
    }

    return {
      total,
      pending,
      replied,
      closed: total - pending - replied,
    };
  }

  /**
   * 获取平台总览数据
   */
  async getPlatformOverview() {
    const [
      userStats,
      demandStats,
      productStats,
      orderStats,
      inquiryStats,
    ] = await Promise.all([
      this.getUserStats(),
      this.getDemandStats(),
      this.getProductStats(),
      this.getOrderStats(),
      this.getInquiryStats(),
    ]);

    return {
      users: userStats,
      demands: demandStats,
      products: productStats,
      orders: orderStats,
      inquiries: inquiryStats,
    };
  }

  /**
   * 获取近30天数据
   */
  async getRecentData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      recentDemands,
      recentProducts,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      this.demandsRepository
        .createQueryBuilder('demand')
        .where('demand.createdAt >= :startDate', { startDate })
        .getMany(),
      this.productsRepository
        .createQueryBuilder('product')
        .where('product.createdAt >= :startDate', { startDate })
        .getMany(),
      this.ordersRepository
        .createQueryBuilder('order')
        .where('order.createdAt >= :startDate', { startDate })
        .getMany(),
      this.usersRepository
        .createQueryBuilder('user')
        .where('user.createdAt >= :startDate', { startDate })
        .getMany(),
    ]);

    return {
      recentDemands: recentDemands.length,
      recentProducts: recentProducts.length,
      recentOrders: recentOrders.length,
      recentUsers: recentUsers.length,
    };
  }

  /**
   * 获取热门类目（按商品数量）
   */
  async getTopCategories(limit: number = 10) {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'category.id',
        'category.name',
        'category.color',
        'category.icon',
        'COUNT(*) as productCount',
      ])
      .where('product.status = :status', { status: 'approved' })
      .groupBy('category.id')
      .orderBy('productCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      id: row.category_id,
      name: row.category_name,
      color: row.category_color,
      icon: row.category_icon,
      productCount: row.productCount,
    }));
  }
}
