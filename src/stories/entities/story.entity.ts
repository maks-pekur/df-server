import { Store } from 'src/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @Column({ default: false })
  isOpen: boolean;

  @ManyToMany(() => Store, (store) => store.stories)
  stores: Store[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
