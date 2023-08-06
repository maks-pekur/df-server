import { Category } from 'src/categories/entities/category.entity';
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

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Store, (store) => store.company, { onDelete: 'CASCADE' })
  stores: Store[];

  @OneToMany(() => Category, (category) => category.company, {
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @OneToMany(() => Product, (product) => product.company, {
    onDelete: 'CASCADE',
  })
  products: Product[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company, {
    onDelete: 'CASCADE',
  })
  userCompanies: UserCompany[];

  @OneToMany(
    () => CompanySubscription,
    (companySubscription) => companySubscription.company,
    { onDelete: 'CASCADE' },
  )
  subscriptions: CompanySubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
