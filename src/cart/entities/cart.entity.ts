import { Customer } from 'src/customers/entities/customer.entity';
import { CartItem } from 'src/types';
import {
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  items: CartItem[];

  @Column()
  totalPrice: number;

  @Column()
  deliveryCost: number;

  @Column()
  loyaltyProgramCoinsRewarded: number;

  @Column()
  loyaltyProgramCoinsSpent: number;

  @Column()
  discount: number;

  @Column()
  paymentMethodType: string;

  @Column()
  orderType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Customer, (customer) => customer.id)
  customer: Customer;
}
