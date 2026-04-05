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
import { Category } from '../../categories/entities/category.entity';

@Entity('demands')
@Index('idx_category', ['categoryId'])
@Index('idx_status', ['status'])
@Index('idx_buyer', ['buyerId'])
export class Demand {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: string;

  @Column({ name: 'buyer_id', type: 'bigint' })
  buyerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // 求购信息
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ name: 'min_qty', type: 'int' })
  minQty: number;

  @Column({ name: 'max_price', type: 'decimal', precision: 10, scale: 2 })
  maxPrice: number;

  @Column({ name: 'demand_desc', type: 'text', nullable: true })
  demandDesc: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  // 状态
  @Column({
    type: 'varchar',
    length: 20,
    default: 'open',
  })
  status: string;

  @Column({ name: 'matched_count', type: 'int', default: 0 })
  matchedCount: number;

  // 标签
  @Column({ type: 'json', nullable: true })
  tags: string[];

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
