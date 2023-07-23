import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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
  type: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => Story, (story) => story.stores)
  stories: Story[];

  @OneToMany(() => Order, (order) => order.storeId)
  orders: Order[];

  @ManyToMany(() => Product)
  @JoinTable()
  stopListProducts: Product[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  stopListIngredients: Ingredient[];

  @ManyToMany(() => User, (user) => user.stores)
  @JoinTable()
  users: User[];

  @Column({ type: 'jsonb', nullable: true })
  location: {
    coordinates: {
      _lon: number;
      _lat: number;
    };
    country: string;
    city: string;
    street: {
      streetTypeName: string;
      name: string;
    };
    houseNumber: string;
  };

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Review, (review) => review.store)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
