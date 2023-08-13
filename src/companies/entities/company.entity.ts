import { Category } from 'src/categories/entities/category.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserCompany } from 'src/users/entities/user-company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanySubscription } from './company-subscription.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Store, (store) => store.company)
  stores: Store[];

  @OneToMany(() => Category, (category) => category.company)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.company)
  ingredients: Ingredient[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  userCompanies: UserCompany[];

  @OneToMany(
    () => CompanySubscription,
    (companySubscription) => companySubscription.company,
  )
  subscriptions: CompanySubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
