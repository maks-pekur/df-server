import { Company } from 'src/companies/entities/company.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => Story, (story) => story.stores)
  @JoinTable()
  stories: Story[];

  @OneToMany(() => Order, (order) => order.store, { onDelete: 'SET NULL' })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.store, { onDelete: 'SET NULL' })
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.stores)
  @JoinTable()
  users: User[];

  @ManyToOne(() => Company, (company) => company.stores)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
