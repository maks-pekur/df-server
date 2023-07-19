import { Customer } from 'src/customers/entities/customer.entity';
import { Store } from 'src/stores/entities/store.entity';
import {
  orderStatus,
  orderType,
  paymentMethod,
  paymentStatus,
} from 'src/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => Customer, (customer) => customer.orders)
  customerId: string;

  @OneToOne(() => Store)
  storeId: string;

  @Column()
  orderNumber: string;

  @Column()
  orderType: orderType;

  @Column()
  orderStatus: orderStatus;

  @Column()
  paymentStatus: paymentStatus;

  @Column()
  paymentMethodType: paymentMethod;

  @CreateDateColumn()
  createdAt: Date;

  statusUpdates: Array<{ [key in orderStatus]?: Date | null }>;
}
