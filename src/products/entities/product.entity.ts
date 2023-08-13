import { Category } from 'src/categories/entities/category.entity';
import { Company } from 'src/companies/entities/company.entity';
import { IngredientGroup } from 'src/ingredients/entities/ingredient-group.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { ModifierGroup } from 'src/modifiers/entities/modifire-group.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('double precision')
  price: number;

  @Column()
  measureUnit: string;

  @Column()
  measureUnitValue: string;

  @Column()
  imageUrl: string;

  @Column({ default: 'good' })
  type: string;

  @Column('double precision', { nullable: true })
  caloriesAmount: number;

  @Column('double precision', { nullable: true })
  proteinAmount: number;

  @Column('double precision', { nullable: true })
  carbohydrateAmount: number;

  @Column('double precision', { nullable: true })
  fatAmount: number;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @ManyToOne(() => Company, (company) => company.products)
  company: Company;

  @ManyToMany(() => StopList, (stopList) => stopList.products)
  stopLists: StopList[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => IngredientGroup, (group) => group.products, { eager: true })
  @JoinTable()
  ingredientGroups: IngredientGroup[];

  @ManyToMany(() => ModifierGroup, (group) => group.products, { eager: true })
  @JoinTable()
  modifierGroups: ModifierGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
