import { Order } from 'src/orders/entities/order.entity';
import { Story } from 'src/stories/entities/story.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Story, (story) => story.stores)
  stories: Story[];

  @OneToMany(() => Order, (order) => order.storeId)
  orders: Order[];
}
