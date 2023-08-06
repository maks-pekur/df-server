import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StopList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Store, (store) => store.stopList)
  store: Store;

  @ManyToMany(() => Product, (product) => product.stopLists)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.stopLists)
  @JoinTable()
  ingredients: Ingredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
