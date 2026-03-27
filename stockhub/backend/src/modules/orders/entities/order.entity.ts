import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('orders')
@Index('idx_buyer', ['buyerId'])
@Index('idx_merchant', ['merchantId'])
@Index('idx_status', ['status'])
@Index('idx_order_no', ['orderNo'])
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'order_no', type: 'varchar', length: 32, unique: true })
  orderNo: string;

  @Column({ name: 'inquiry_id', type: 'bigint', nullable: true })
  inquiryId: string;

  @Column({ name: 'buyer_id', type: 'bigint' })
  buyerId: string;

  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: string;

  // 状态
  @Column({
    type: 'enum',
    enum: ['pending_deposit', 'deposit_paid', 'production', 'shipped', 'delivered', 'cancelled'],
    default: 'pending_deposit',
  })
  status: 'pending_deposit' | 'deposit_paid' | 'production' | 'shipped' | 'delivered' | 'cancelled';

  // 金额信息
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'shipping_cost', type: 'decimal', precision: 12, scale: 2 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: ['CNY', 'USD'], default: 'USD' })
  currency: 'CNY' | 'USD';

  // 支付信息
  @Column({ name: 'deposit_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  depositAmount: number;

  @Column({ name: 'deposit_paid_at', type: 'timestamp', nullable: true })
  depositPaidAt: Date;

  @Column({ name: 'balance_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  balanceAmount: number;

  @Column({ name: 'balance_paid_at', type: 'timestamp', nullable: true })
  balancePaidAt: Date;

  // 物流信息
  @Column({ name: 'shipping_method', type: 'varchar', length: 50, nullable: true })
  shippingMethod: string;

  @Column({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ name: 'carrier', type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ name: 'estimated_delivery', type: 'date', nullable: true })
  estimatedDelivery: Date;

  @Column({ name: 'actual_delivery', type: 'timestamp', nullable: true })
  actualDelivery: Date;

  // 收货地址
  @Column({ name: 'shipping_address', type: 'json', nullable: true })
  shippingAddress: {
    companyName: string;
    contactPerson: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
