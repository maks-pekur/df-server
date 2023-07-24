import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class StopList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (product) => product.id, { nullable: true })
  @JoinColumn({ name: 'productIds' })
  products: Product[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'ingredientIds' })
  ingredients: Ingredient[];
}
