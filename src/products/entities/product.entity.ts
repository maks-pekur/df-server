import { Category } from 'src/categories/entities/category.entity';
import { IngredientGroup } from 'src/ingredients/entities/ingredient-group.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { ModifierGroup } from 'src/modifiers/entities/modifire-group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products, {
    eager: true,
  })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => IngredientGroup, (group) => group.products, { eager: true })
  @JoinTable()
  ingredientGroups: IngredientGroup[];

  @ManyToMany(() => ModifierGroup, (group) => group.products, { eager: true })
  @JoinTable()
  modifierGroups: ModifierGroup[];

  @Column({ default: 0 })
  price: number;

  @Column({ default: '' })
  measureUnit: string;

  @Column({ default: '' })
  measureUnitValue: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ default: 'good' })
  type: string;

  @Column({ default: 0 })
  caloriesAmount: number;

  @Column({ default: 0 })
  energyAmount: number;

  @Column({ default: 0 })
  proteinAmount: number;

  @Column({ default: 0 })
  carbohydrateAmount: number;

  @Column({ default: 0 })
  fatAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
