import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  isInStopList?: boolean;

  @Column({ default: 'ingredient' })
  type: string;

  @OneToMany(() => IngredientGroup, (group) => group.ingredients)
  groups: IngredientGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
