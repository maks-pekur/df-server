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
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './../../stores/entities/store.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

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

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'storeId' })
  storeId: Store;
}
