import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionStatus } from 'src/types';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanySubscription } from './entities/company-subscription.entity';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanySubscription)
    private readonly companySubscriptionRepository: Repository<CompanySubscription>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    const savedCompany = await this.companyRepository.save(company);

    const subscription = await this.subscriptionRepository.findOne({
      where: { id: createCompanyDto.subscriptionId },
    });
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const companySubscription = new CompanySubscription();
    companySubscription.company = savedCompany;
    companySubscription.subscription = subscription;
    companySubscription.status = SubscriptionStatus.ACTIVE;

    if (createCompanyDto.trialPeriod) {
      companySubscription.startDate = new Date();
      companySubscription.endDate = addDays(new Date(), 14);
    } else {
      companySubscription.startDate = new Date();
      companySubscription.endDate = null;
    }

    await this.companySubscriptionRepository.save(companySubscription);

    return savedCompany;
  }

  async findAll() {
    return await this.companyRepository.find();
  }

  async findOne(id: string) {
    return await this.companyRepository.findOne({ where: { id } });
  }

  async getCompanySubscription(
    companyId: string,
  ): Promise<CompanySubscription> {
    return this.companySubscriptionRepository.findOne({
      where: { company: { id: companyId } },
      relations: ['subscription'],
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(id, updateCompanyDto);
    return await this.companyRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.companyRepository.delete(id);
  }
}
