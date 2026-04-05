import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'buyer' })
  role: 'buyer' | 'merchant' | 'admin';

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
