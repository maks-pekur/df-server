import { Company } from 'src/companies/entities/company.entity';
import { Product } from 'src/products/entities/product.entity';
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
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToOne(() => Company, (company) => company.categories)
  company: Company;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable({
    name: 'category_products',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
