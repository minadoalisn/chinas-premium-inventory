import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(params: { buyerId?: string; merchantId?: string; page?: number; limit?: number; status?: string }) {
    const { buyerId, merchantId, page = 1, limit = 20, status } = params;

    const where: any = {};
    if (buyerId) {
      where.buyerId = buyerId;
    }
    if (merchantId) {
      where.merchantId = merchantId;
    }
    if (status) {
      where.status = status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: orders.map((o) => this.formatOrder(o)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      data: this.formatOrder(order, true),
    };
  }

  async create(createData: Partial<Order>) {
    const orderNo = `ORD-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    
    const order = this.orderRepository.create({
      ...createData,
      orderNo,
      status: 'pending_deposit',
    });
    
    return await this.orderRepository.save(order);
  }

  async update(id: string, updateData: Partial<Order>) {
    await this.orderRepository.update({ id }, updateData);
    return this.findOne(id);
  }

  async cancel(id: string, reason?: string) {
    await this.orderRepository.update(
      { id },
      { status: 'cancelled' },
    );
    return {
      success: true,
      data: { id, status: 'cancelled' },
      message: reason || 'Order cancelled',
    };
  }

  async updateStatus(id: string, status: Order['status']) {
    const updateData: any = { status };
    
    if (status === 'deposit_paid') {
      updateData.depositPaidAt = new Date();
    } else if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.actualDelivery = new Date();
    }
    
    await this.orderRepository.update({ id }, updateData);
    return this.findOne(id);
  }

  private formatOrder(order: Order, detailed = false) {
    const base = {
      id: order.id,
      orderNo: order.orderNo,
      inquiryId: order.inquiryId,
      buyerId: order.buyerId,
      merchantId: order.merchantId,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      currency: order.currency,
      depositAmount: order.depositAmount,
      balanceAmount: order.balanceAmount,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
    };

    if (detailed) {
      return {
        ...base,
        tax: order.tax,
        discount: order.discount,
        depositPaidAt: order.depositPaidAt,
        balancePaidAt: order.balancePaidAt,
        actualDelivery: order.actualDelivery,
        shippingAddress: order.shippingAddress,
      };
    }

    return base;
  }
}
