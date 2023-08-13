import { Company } from 'src/companies/entities/company.entity';
import { Order } from 'src/orders/entities/order.entity';
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

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.stores)
  company: Company;

  @OneToOne(() => StopList, (stopList) => stopList.store, {
    onDelete: 'CASCADE',
  })
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
