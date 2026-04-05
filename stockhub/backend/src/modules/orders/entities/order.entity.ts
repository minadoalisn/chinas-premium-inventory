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
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: string;

  @Column({ name: 'order_no', type: 'varchar', length: 32, unique: true })
  orderNo: string;

  @Column({ name: 'buyer_id', type: 'bigint' })
  buyerId: string;

  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: string;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: string;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'currency', type: 'varchar', length: 10, default: 'CNY' })
  currency: string;

  // 付款状态
  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending_deposit',
  })
  paymentStatus: string;

  @Column({ name: 'deposit_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  depositAmount: number;

  @Column({ name: 'deposit_paid_at', type: 'datetime', nullable: true })
  depositPaidAt: Date;

  @Column({ name: 'balance_paid_at', type: 'datetime', nullable: true })
  balancePaidAt: Date;

  // 物流信息
  @Column({ name: 'shipping_method', type: 'varchar', length: 50, nullable: true })
  shippingMethod: string;

  @Column({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ name: 'carrier', type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ name: 'shipping_address', type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  // 订单状态
  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending_deposit',
  })
  status: string;

  @Column({ name: 'order_notes', type: 'text', nullable: true })
  orderNotes: string;

  @Column({ name: 'created_by', type: 'varchar', length: 20 })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 20 })
  updatedBy: string;

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
