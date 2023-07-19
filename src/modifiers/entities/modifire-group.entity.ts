import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Modifier } from './modifire.entity';

@Entity()
export class ModifierGroup {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Modifier, (modifier) => modifier.group)
  modifiers: Modifier[];

  @UpdateDateColumn()
  updatedAt: Date;
}
