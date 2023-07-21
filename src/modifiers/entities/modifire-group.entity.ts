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
import { Modifier } from './modifire.entity';

@Entity()
export class ModifierGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Modifier, (modifier) => modifier.group)
  modifiers: Modifier[];

  @ManyToMany(() => Product, (product) => product.modifierGroups)
  products: Product[];

  @UpdateDateColumn()
  updatedAt: Date;
}
