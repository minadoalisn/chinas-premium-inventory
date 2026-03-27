import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async findAll(params: { buyerId?: string; page?: number; limit?: number; status?: string }) {
    const { buyerId, page = 1, limit = 20, status } = params;

    const where: any = {};
    if (buyerId) {
      where.buyerId = buyerId;
    }
    if (status) {
      where.status = status;
    }

    const [inquiries, total] = await this.inquiryRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: inquiries.map((i) => this.formatInquiry(i)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const inquiry = await this.inquiryRepository.findOne({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return {
      success: true,
      data: this.formatInquiry(inquiry, true),
    };
  }

  async create(createData: Partial<Inquiry>) {
    const inquiryNo = `INQ-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    
    const inquiry = this.inquiryRepository.create({
      ...createData,
      inquiryNo,
      status: 'pending',
    });
    
    return await this.inquiryRepository.save(inquiry);
  }

  async update(id: string, updateData: Partial<Inquiry>) {
    await this.inquiryRepository.update({ id }, updateData);
    return this.findOne(id);
  }

  async acceptQuote(id: string) {
    // 将询盘状态改为确认，并创建订单
    await this.inquiryRepository.update(
      { id },
      { status: 'confirmed', confirmedAt: new Date() },
    );
    
    // TODO: 创建订单
    
    return {
      success: true,
      data: { inquiryId: id, status: 'confirmed' },
      message: 'Quote accepted, order will be created',
    };
  }

  private formatInquiry(inquiry: Inquiry, detailed = false) {
    const base = {
      id: inquiry.id,
      inquiryNo: inquiry.inquiryNo,
      buyerCompanyName: inquiry.buyerCompanyName,
      buyerContactName: inquiry.buyerContactName,
      buyerEmail: inquiry.buyerEmail,
      productIds: inquiry.productIds,
      totalQty: inquiry.totalQty,
      estimatedAmount: inquiry.estimatedAmount,
      targetCountry: inquiry.targetCountry,
      targetPort: inquiry.targetPort,
      paymentMethod: inquiry.paymentMethod,
      shippingMethod: inquiry.shippingMethod,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    };

    if (detailed) {
      return {
        ...base,
        productDetails: inquiry.productDetails,
        message: inquiry.message,
        expectedDeliveryDate: inquiry.expectedDeliveryDate,
        shippingCost: inquiry.shippingCost,
        quotedAt: inquiry.quotedAt,
        confirmedAt: inquiry.confirmedAt,
        shippedAt: inquiry.shippedAt,
      };
    }

    return base;
  }
}
