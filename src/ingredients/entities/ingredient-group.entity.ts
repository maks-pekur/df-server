import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity()
export class IngredientGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.groups, {
    eager: true,
  })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => Product, (product) => product.ingredientGroups)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
