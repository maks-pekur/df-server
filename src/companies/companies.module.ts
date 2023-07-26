import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanySubscription } from './entities/company-subscription.entity';
import { Company } from './entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanySubscription, Subscription]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
