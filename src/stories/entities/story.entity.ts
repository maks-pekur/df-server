import { Store } from 'src/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  title: string;

  @Column()
  imageUrl: string;

  @Column({ default: false })
  isOpen: boolean;

  @ManyToOne(() => Store, (store) => store.stories)
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
