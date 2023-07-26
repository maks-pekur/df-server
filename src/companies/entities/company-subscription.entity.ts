import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionStatus } from 'src/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class CompanySubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.companySubscriptions,
  )
  subscription: Subscription;

  @ManyToOne(() => Company, (company) => company.companySubscriptions, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;
}
