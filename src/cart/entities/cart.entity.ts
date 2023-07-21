import { CartItem } from 'src/types';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  items: CartItem[];

  @Column({ default: 0 })
  totalPrice: number;

  @Column({ default: 0 })
  deliveryCost: number;

  @Column({ default: 0 })
  loyaltyProgramCoinsRewarded: number;

  @Column({ default: 0 })
  loyaltyProgramCoinsSpent: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 'card' })
  paymentMethodType: string;

  @Column()
  orderType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
