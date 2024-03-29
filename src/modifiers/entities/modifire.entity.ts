import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModifierGroup } from './modifire-group.entity';

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  price: number;

  @ManyToOne(() => ModifierGroup)
  group: ModifierGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
