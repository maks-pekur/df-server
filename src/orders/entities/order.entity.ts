import {
  orderStatus,
  orderType,
  paymentMethod,
  paymentStatus,
} from 'src/types';
import { User } from 'src/users/entities/user.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: string;

  @Column({ type: 'enum', enum: orderType, default: orderType.TAKE_AWAY })
  orderType: orderType;

  @Column({ type: 'enum', enum: orderStatus, default: orderStatus.PENDING })
  orderStatus: orderStatus;

  @Column({ type: 'enum', enum: paymentStatus, default: paymentStatus.PENDING })
  paymentStatus: paymentStatus;

  @Column({ type: 'enum', enum: paymentMethod, default: paymentMethod.CARD })
  paymentMethod: paymentMethod;

  statusUpdates: Array<{ [key in orderStatus]?: Date | null }>;

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'storeId' })
  storeId: Store;

  @ManyToOne(() => User, (user) => user.orders)
  userId: User;

  @CreateDateColumn()
  createdAt: Date;
}
