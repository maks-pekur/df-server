import { Order } from 'src/orders/entities/order.entity';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column({ default: 0 })
  tasteRating: number;

  @Column({ default: 0 })
  serviceRating: number;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  user: User;

  @ManyToOne(() => Order, (order) => order.reviews, { nullable: true })
  order: Order;

  @ManyToOne(() => Store, (store) => store.reviews)
  store: Store;

  @CreateDateColumn()
  createdAt: Date;
}
