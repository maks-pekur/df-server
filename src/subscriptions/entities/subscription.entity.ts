import { CompanySubscription } from 'src/companies/entities/company-subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  companySubscriptions: CompanySubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
