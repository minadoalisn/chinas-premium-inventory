import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async findAll(params?: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = params || {};

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [merchants, total] = await this.merchantRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: merchants.map((m) => this.formatMerchant(m)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return {
      success: true,
      data: this.formatMerchant(merchant, true),
    };
  }

  async findByUserId(userId: string) {
    const merchant = await this.merchantRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    return merchant ? this.formatMerchant(merchant, true) : null;
  }

  async create(data: Partial<Merchant>) {
    const merchant = this.merchantRepository.create(data);
    return await this.merchantRepository.save(merchant);
  }

  async update(id: string, updateData: Partial<Merchant>) {
    await this.merchantRepository.update({ id }, updateData);
    return this.findOne(id);
  }

  async getProducts(id: string, page = 1, limit = 20) {
    // 后续关联到 products 模块
    return {
      success: true,
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  private formatMerchant(merchant: Merchant, detailed = false) {
    const base = {
      id: merchant.id,
      companyName: merchant.companyName,
      contactPerson: merchant.contactPerson,
      phone: merchant.phone,
      city: merchant.city,
      province: merchant.province,
      country: merchant.country,
      status: merchant.status,
      rating: merchant.rating,
      completedOrders: merchant.completedOrders,
      responseRate: merchant.responseRate,
      responseTime: merchant.responseTime,
    };

    if (detailed) {
      return {
        ...base,
        address: merchant.address,
        businessLicense: merchant.businessLicense,
        certifications: merchant.certifications,
        factoryArea: merchant.factoryArea,
        employeeCount: merchant.employeeCount,
        established: merchant.approvedAt,
        createdAt: merchant.createdAt,
      };
    }

    return base;
  }
}
