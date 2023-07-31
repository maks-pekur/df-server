import { Company } from 'src/companies/entities/company.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Story } from 'src/stories/entities/story.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  stories: Story[];

  @OneToMany(() => Order, (order) => order.storeId, { onDelete: 'SET NULL' })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.store, { onDelete: 'SET NULL' })
  reviews: Review[];

  @ManyToOne(() => Company, (company) => company.stores)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
