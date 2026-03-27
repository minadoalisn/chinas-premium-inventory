import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
@Index('idx_parent', ['parentId'])
@Index('idx_sort', ['sortOrder'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', type: 'int', default: 0 })
  parentId: number;

  // 多语言名称
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'name_en', type: 'varchar', length: 100 })
  nameEn: string;

  @Column({ name: 'name_ja', type: 'varchar', length: 100, nullable: true })
  nameJa: string;

  @Column({ name: 'name_ko', type: 'varchar', length: 100, nullable: true })
  nameKo: string;

  // 类目属性
  @Column({ name: 'icon_url', type: 'varchar', length: 255, nullable: true })
  iconUrl: string;

  @Column({ name: 'banner_url', type: 'varchar', length: 255, nullable: true })
  bannerUrl: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // SEO信息
  @Column({ name: 'seo_title', type: 'varchar', length: 200, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_keywords', type: 'varchar', length: 200, nullable: true })
  seoKeywords: string;

  // 关联
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // 时间戳
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
