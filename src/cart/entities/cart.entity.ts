import { ICartItem, OrderType, PaymentMethod } from 'src/common/types';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  items: ICartItem[];

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
  paymentMethod: PaymentMethod;

  @Column()
  orderType: OrderType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
