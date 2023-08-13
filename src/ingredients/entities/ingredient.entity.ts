import { Company } from 'src/companies/entities/company.entity';
import { Product } from 'src/products/entities/product.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
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

  @Column('double precision')
  price: number;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Product)
  products: Product[];

  @ManyToMany(() => StopList, (stopList) => stopList.products)
  stopLists: StopList[];

  @Column({ default: 'ingredient' })
  type: string;

  @ManyToMany(() => IngredientGroup, (group) => group.ingredients)
  groups: IngredientGroup[];

  @ManyToOne(() => Company, (company) => company.ingredients)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
