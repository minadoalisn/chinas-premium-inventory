import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Merchant } from '../merchants/entities/merchant.entity';
import { Demand } from '../demands/entities/demand.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Demand)
    private demandRepository: Repository<Demand>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  // ==================== 统计数据 ====================

  async getDashboard() {
    const [
      userCount,
      merchantCount,
      demandCount,
      productCount,
      orderCount,
      totalRevenue,
    ] = await Promise.all([
      this.userRepository.count(),
      this.merchantRepository.count(),
      this.demandRepository.count(),
      this.productRepository.count(),
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.totalPrice)', 'total')
        .getRawOne(),
    ]);

    return {
      userCount,
      userGrowth: this.calculateGrowth('users'),
      merchantCount,
      merchantGrowth: this.calculateGrowth('merchants'),
      demandCount,
      demandGrowth: this.calculateGrowth('demands'),
      productCount,
      productGrowth: this.calculateGrowth('products'),
      orderCount,
      orderGrowth: this.calculateGrowth('orders'),
      revenue: totalRevenue?.total || 0,
      revenueGrowth: this.calculateRevenueGrowth(),
    };
  }

  async getOrderTrend(period: number) {
    const results = await this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_FORMAT(order.created_at, '%Y-%m-%d') as date, COUNT(*) as value")
      .where('order.created_at >= DATE_SUB(NOW(), :days)', { days: period })
      .groupBy("DATE_FORMAT(order.created_at, '%Y-%m-%d')")
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map((r: any) => ({
      label: this.formatDate(r.date),
      value: parseInt(r.value),
    }));
  }

  async getRecentActivities(limit: number) {
    // 模拟数据 - 实际应该从activity表查询
    return [
      {
        id: '1',
        type: 'user',
        text: '新用户注册',
        time: new Date(),
      },
      {
        id: '2',
        type: 'merchant',
        text: '商户申请待审核',
        time: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        type: 'order',
        text: '新订单创建',
        time: new Date(Date.now() - 7200000),
      },
      {
        id: '4',
        type: 'product',
        text: '商品上架',
        time: new Date(Date.now() - 10800000),
      },
    ].slice(0, limit);
  }

  // ==================== 用户管理 ====================

  async getUsers(params: any) {
    const { page = 1, limit = 20, search, status, role } = params;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.merchant', 'merchant');

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  async getUserDetail(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['merchant'],
    });
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive') {
    const isActive = status === 'active';
    await this.userRepository.update(id, { isActive });
    return { success: true, message: '用户状态已更新' };
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
    return { success: true, message: '用户已删除' };
  }

  // ==================== 商户管理 ====================

  async getMerchants(params: any) {
    const { page = 1, limit = 20, search, status } = params;

    const queryBuilder = this.merchantRepository.createQueryBuilder('merchant');

    if (search) {
      queryBuilder.andWhere(
        '(merchant.name LIKE :search OR merchant.company LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('merchant.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  async getMerchantDetail(id: string) {
    return this.merchantRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async approveMerchant(id: string) {
    await this.merchantRepository.update(id, { status: 'approved' });
    return { success: true, message: '商户已通过审核' };
  }

  async rejectMerchant(id: string) {
    await this.merchantRepository.update(id, { status: 'rejected' });
    return { success: true, message: '商户已拒绝' };
  }

  // ==================== 商品管理 ====================

  async getProducts(params: any) {
    const { page = 1, limit = 20, search, status, categoryId } = params;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.merchant', 'merchant')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      queryBuilder.andWhere('product.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  async getProductDetail(id: string) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['merchant', 'category'],
    });
  }

  async approveProduct(id: string) {
    await this.productRepository.update(id, { status: 'approved' });
    return { success: true, message: '商品已通过审核' };
  }

  async rejectProduct(id: string) {
    await this.productRepository.update(id, { status: 'rejected' });
    return { success: true, message: '商品已拒绝' };
  }

  async listProduct(id: string) {
    await this.productRepository.update(id, { status: 'approved' });
    return { success: true, message: '商品已上架' };
  }

  async unlistProduct(id: string) {
    await this.productRepository.update(id, { status: 'rejected' });
    return { success: true, message: '商品已下架' };
  }

  // ==================== 订单管理 ====================

  async getOrders(params: any) {
    const { page = 1, limit = 20, status, buyerId, sellerId } = params;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndSelect('order.product', 'product');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (buyerId) {
      queryBuilder.andWhere('order.buyerId = :buyerId', { buyerId });
    }

    if (sellerId) {
      queryBuilder.andWhere('order.sellerId = :sellerId', { sellerId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('order.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  async getOrderDetail(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['buyer', 'seller', 'product'],
    });
  }

  async shipOrder(id: string, trackingNumber: string, logisticsCompany: string) {
    await this.orderRepository.update(id, {
      status: 'shipped',
      trackingNumber,
    });
    return { success: true, message: '订单已发货' };
  }

  async cancelOrder(id: string) {
    await this.orderRepository.update(id, { status: 'cancelled' });
    return { success: true, message: '订单已取消' };
  }

  // ==================== 求购管理 ====================

  async getDemands(params: any) {
    const { page = 1, limit = 20, search, status } = params;

    const queryBuilder = this.demandRepository
      .createQueryBuilder('demand')
      .leftJoinAndSelect('demand.user', 'user')
      .leftJoinAndSelect('demand.category', 'category');

    if (search) {
      queryBuilder.andWhere('demand.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('demand.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('demand.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  async getDemandDetail(id: string) {
    return this.demandRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
  }

  async deleteDemand(id: string) {
    await this.demandRepository.delete(id);
    return { success: true, message: '求购已删除' };
  }

  // ==================== 类目管理 ====================

  async getCategories() {
    return this.categoryRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async createCategory(createCategoryDto: any) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, updateCategoryDto: any) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.categoryRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string) {
    await this.categoryRepository.delete(id);
    return { success: true, message: '类目已删除' };
  }

  // ==================== 系统设置 ====================

  async getSettings() {
    // 从数据库或配置文件读取
    return {
      site: {
        name: 'StockHub',
        title: '跨境库存交易平台',
        description: '专业的跨境库存求购和特卖平台',
        logo: '',
      },
      payment: {
        alipay: { enabled: false, appId: '' },
        wechat: { enabled: false, appId: '' },
        paypal: { enabled: false, clientId: '' },
      },
      logistics: {
        sf: { enabled: true, apiKey: '' },
        dhl: { enabled: false, apiKey: '' },
        fedex: { enabled: false, apiKey: '' },
        ups: { enabled: false, apiKey: '' },
      },
      sms: {
        enabled: true,
        username: 'mengge',
        sign: '【库存易】',
      },
      oss: {
        enabled: false,
        region: '',
        bucket: '',
      },
    };
  }

  async updateSettings(settingsDto: any) {
    // 保存到数据库或配置文件
    return { success: true, message: '设置已更新' };
  }

  async getSettingsSection(section: string) {
    const settings = await this.getSettings();
    return settings[section];
  }

  async updateSettingsSection(section: string, settingsDto: any) {
    // 更新特定部分
    return { success: true, message: `${section}设置已更新` };
  }

  // ==================== 工具方法 ====================

  private calculateGrowth(table: string): number {
    // 计算增长率（实际应该查询数据库）
    return Math.floor(Math.random() * 20) + 5;
  }

  private calculateRevenueGrowth(): number {
    // 计算收入增长率
    return Math.floor(Math.random() * 30) + 10;
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
}
