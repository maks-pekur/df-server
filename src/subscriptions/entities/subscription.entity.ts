import { CompanySubscription } from 'src/companies/entities/company-subscription.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  monthlyPrice: number;

  @Column({ default: 0 })
  yearlyPrice: number;

  @OneToMany(
    () => CompanySubscription,
    (companySubscription) => companySubscription.subscription,
  )
  companySubscription: CompanySubscription[];

  @ManyToMany(() => Permission, (permission) => permission.subscriptions, {
    eager: true,
  })
  @JoinTable()
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
