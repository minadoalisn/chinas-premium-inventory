import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('inquiries')
@Index('idx_buyer', ['buyerId'])
@Index('idx_status', ['status'])
export class Inquiry {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: string;

  @Column({ name: 'buyer_id', type: 'bigint' })
  buyerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column({ name: 'buyer_company_name', type: 'varchar', length: 200 })
  buyerCompanyName: string;

  @Column({ name: 'buyer_name', type: 'varchar', length: 100 })
  buyerName: string;

  @Column({ name: 'buyer_email', type: 'varchar', length: 100 })
  buyerEmail: string;

  @Column({ name: 'buyer_phone', type: 'varchar', length: 50, nullable: true })
  buyerPhone: string;

  // 询盘商品
  @Column({ name: 'product_ids', type: 'json' })
  productIds: string[];

  @Column({ name: 'product_details', type: 'json', nullable: true })
  productDetails: string;

  // 询盘信息
  @Column({ type: 'text', nullable: true })
  message: string;

  // 询盘状态
  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string;

  @Column({ name: 'buyer_viewed_at', type: 'datetime', nullable: true })
  buyerViewedAt: Date;

  // 询盘回复
  @Column({ name: 'merchant_reply', type: 'text', nullable: true })
  merchantReply: string;

  @Column({ name: 'merchant_viewed_at', type: 'datetime', nullable: true })
  merchantViewedAt: Date;

  @Column({ name: 'last_activity_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastActivityAt: Date;

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
