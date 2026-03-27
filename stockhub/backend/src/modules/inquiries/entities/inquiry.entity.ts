import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('inquiries')
@Index('idx_buyer', ['buyerId'])
@Index('idx_status', ['status'])
export class Inquiry {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'inquiry_no', type: 'varchar', length: 50, unique: true })
  inquiryNo: string;

  @Column({ name: 'buyer_id', type: 'bigint' })
  buyerId: string;

  @Column({ name: 'buyer_company_name', type: 'varchar', length: 200, nullable: true })
  buyerCompanyName: string;

  @Column({ name: 'buyer_contact_name', type: 'varchar', length: 100, nullable: true })
  buyerContactName: string;

  @Column({ name: 'buyer_email', type: 'varchar', length: 100 })
  buyerEmail: string;

  @Column({ name: 'buyer_phone', type: 'varchar', length: 50, nullable: true })
  buyerPhone: string;

  // 询盘商品
  @Column({ name: 'product_ids', type: 'json' })
  productIds: string[];

  @Column({ name: 'product_details', type: 'json', nullable: true })
  productDetails: Array<{
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }>;

  // 询盘信息
  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ name: 'target_country', type: 'varchar', length: 100, nullable: true })
  targetCountry: string;

  @Column({ name: 'target_port', type: 'varchar', length: 100, nullable: true })
  targetPort: string;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  // 数量与价格
  @Column({ name: 'total_qty', type: 'int' })
  totalQty: number;

  @Column({ name: 'estimated_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedAmount: number;

  // 支付方式
  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: ['L/C', 'T/T', 'PayPal', 'Western Union', 'Other'],
    nullable: true,
  })
  paymentMethod: 'L/C' | 'T/T' | 'PayPal' | 'Western Union' | 'Other';

  // 物流信息
  @Column({
    name: 'shipping_method',
    type: 'enum',
    enum: ['Air', 'Sea', 'Land', 'Express'],
    nullable: true,
  })
  shippingMethod: 'Air' | 'Sea' | 'Land' | 'Express';

  @Column({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  shippingCost: number;

  // 状态
  @Column({
    type: 'enum',
    enum: ['pending', 'quoted', 'negotiating', 'confirmed', 'shipped', 'closed'],
    default: 'pending',
  })
  status: 'pending' | 'quoted' | 'negotiating' | 'confirmed' | 'shipped' | 'closed';

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'quoted_at', type: 'timestamp', nullable: true })
  quotedAt: Date;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date;
}
