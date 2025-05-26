import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; // Assuming payments are tied to a user

  @Column()
  type!: string; // e.g., 'topup', 'send', 'convert'

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column()
  currency!: string;

  @Column({ nullable: true })
  targetCurrency?: string; // For currency conversion

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  conversionRate?: number; // For currency conversion

  @CreateDateColumn()
  createdAt!: Date;
}