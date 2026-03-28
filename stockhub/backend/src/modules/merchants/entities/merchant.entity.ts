import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('merchants')
@Index('idx_status', ['status'])
export class Merchant {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 基本信息
  @Column({ name: 'company_name', type: 'varchar', length: 200 })
  companyName: string;

  @Column({ name: 'business_license', type: 'varchar', length: 50, unique: true, })
  businessLicense: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 100 })
  contactPerson: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  // 地址信息
  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string;

  @Column({ type: 'varchar', length: 100, default: 'China' })
  country: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  // 公司规模
  @Column({ name: 'factory_area', type: 'decimal', precision: 10, scale: 2, nullable: true })
  factoryArea: number;

  @Column({ name: 'employee_count', type: 'int', nullable: true })
  employeeCount: number;

  @Column({ name: 'production_lines', type: 'int', nullable: true })
  productionLines: number;

  @Column({ name: 'annual_revenue', type: 'decimal', precision: 15, scale: 2, nullable: true })
  annualRevenue: number;

  // 资质认证
  @Column({ type: 'json', nullable: true })
  certifications: string[];

  @Column({ name: 'product_images', type: 'json', nullable: true })
  productImages: string[];

  // 商户状态
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  // 信用评分
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ name: 'completed_orders', type: 'int', default: 0 })
  completedOrders: number;

  @Column({ name: 'total_reviews', type: 'int', default: 0 })
  totalReviews: number;

  @Column({ name: 'response_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  responseRate: number;

  @Column({ name: 'response_time', type: 'varchar', length: 20, default: '24h' })
  responseTime: string;

  // 财务信息
  @Column({ name: 'bank_name', type: 'varchar', length: 200, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account', type: 'varchar', length: 100, nullable: true })
  bankAccount: string;

  @Column({ name: 'swift_code', type: 'varchar', length: 20, nullable: true })
  swiftCode: string;

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;
}
