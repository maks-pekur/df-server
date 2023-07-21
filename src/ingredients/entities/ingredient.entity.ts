import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngredientGroup } from './ingredient-group.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Product, (product) => product.ingredients)
  products: Product[];

  @Column()
  isInStopList?: boolean;

  @Column({ default: 'ingredient' })
  type: string;

  @ManyToMany(() => IngredientGroup, (group) => group.ingredients)
  groups: IngredientGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
