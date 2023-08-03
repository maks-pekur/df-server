import { Review } from 'src/reviews/entities/review.entity';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from 'src/types';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './../../stores/entities/store.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.TAKE_AWAY })
  orderType: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CARD })
  paymentMethod: PaymentMethod;

  statusUpdates: Array<{ [key in OrderStatus]?: Date | null }>;

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @ManyToOne(() => User, (user) => user.orders)
  userId: User;

  @OneToMany(() => Review, (review) => review.order)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;
}
