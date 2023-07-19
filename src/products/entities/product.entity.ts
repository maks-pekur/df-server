import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  categoryId: string;

  @Column()
  measureUnit: string;

  @Column({ default: 0 })
  measureUnitValue: string;

  @Column()
  imageUrl: string;

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
