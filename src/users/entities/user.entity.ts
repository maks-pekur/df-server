import { Order } from 'src/orders/entities/order.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserRole } from 'src/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Order, (order) => order.userId)
  orders: Order[];

  @ManyToMany(() => Store, (store) => store.users)
  stores: Store[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
