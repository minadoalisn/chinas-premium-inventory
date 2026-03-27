import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';
import { Merchant } from './merchant.entity';

@Entity('products')
@Index('idx_category', ['category'])
@Index('idx_merchant', ['merchant'])
@Index('idx_status', ['status'])
@Index('idx_display_domestic', ['displayDomestic', 'status'])
@Index('idx_display_overseas', ['displayOverseas', 'status'])
export class Product {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: string;

  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // 中文信息（国内展示）
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 英文信息（海外展示）
  @Column({ name: 'title_en', type: 'varchar', length: 255, nullable: true })
  titleEn: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  // URL Slug
  @Column({ type: 'varchar', length: 300, unique: true })
  slug: string;

  // 规格参数
  @Column({ type: 'json', nullable: true })
  specifications: Record<string, any>;

  // 媒体资源
  @Column({ type: 'json' })
  images: string[];

  @Column({ type: 'json', nullable: true })
  videos: string[];

  // SKU信息
  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  // 库存与价格
  @Column({ name: 'stock_qty', type: 'int', default: 0 })
  stockQty: number;

  @Column({ name: 'domestic_price', type: 'decimal', precision: 10, scale: 2 })
  domesticPrice: number;

  @Column({ name: 'overseas_price', type: 'decimal', precision: 10, scale: 2 })
  overseasPrice: number;

  @Column({ name: 'min_order_qty', type: 'int', default: 1 })
  minOrderQty: number;

  // 批发价格梯度
  @Column({ name: 'wholesale_tiers', type: 'json', nullable: true })
  wholesaleTiers: Array<{
    minQty: number;
    unitPrice: number;
    currency: string;
    savings?: string;
  }>;

  // 展示权限控制
  @Column({ name: 'display_domestic', type: 'boolean', default: true })
  displayDomestic: boolean;

  @Column({ name: 'display_overseas', type: 'boolean', default: true })
  displayOverseas: boolean;

  // 临期标记
  @Column({ name: 'is_expired', type: 'boolean', default: false })
  isExpired: boolean;

  @Column({ name: 'expire_date', type: 'date', nullable: true })
  expireDate: Date;

  // 审核状态
  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'sold_out'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected' | 'sold_out';

  // SEO信息
  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ name: 'seo_keywords', type: 'varchar', length: 500, nullable: true })
  seoKeywords: string;

  // 统计数据
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'inquiry_count', type: 'int', default: 0 })
  inquiryCount: number;

  @Column({ name: 'sold_count', type: 'int', default: 0 })
  soldCount: number;

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'synced_at', type: 'timestamp', nullable: true })
  syncedAt: Date;
}
