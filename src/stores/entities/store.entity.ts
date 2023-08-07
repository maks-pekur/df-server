import { Category } from 'src/categories/entities/category.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @ManyToOne(() => Company, (company) => company.stores)
  company: Company;

  @ManyToMany(() => Category, (category) => category.stores)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Product, (product) => product.stores)
  @JoinTable()
  products: Product[];

  @OneToOne(() => StopList, (stopList) => stopList.store)
  @JoinColumn()
  stopList: StopList;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
