import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, addMonths, addYears } from 'date-fns';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionPeriod, SubscriptionStatus } from 'src/types';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanySubscription } from './entities/company-subscription.entity';
import { Company } from './entities/company.entity';

const PROMISED_DAYS = 3;

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

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    const savedCompany = await this.companyRepository.save(company);

    const subscription = await this.subscriptionRepository.findOne({
      where: { id: createCompanyDto.subscriptionId },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    const companySubscription = new CompanySubscription();
    companySubscription.company = savedCompany;
    companySubscription.subscription = subscription;
    companySubscription.startDate = new Date();
    companySubscription.endDate = addDays(new Date(), 7);
    companySubscription.status = SubscriptionStatus.TRIAL;

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

  async updateSubscription(
    companyId: string,
    newSubscriptionId: string,
    isPaymentPromised: boolean,
    period: SubscriptionPeriod,
  ): Promise<CompanySubscription> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    const currentSubscription =
      await this.companySubscriptionRepository.findOne({
        where: {
          company: { id: company.id },
          status: SubscriptionStatus.ACTIVE || SubscriptionStatus.TRIAL,
        },
      });

    if (currentSubscription) {
      currentSubscription.status = SubscriptionStatus.EXPIRED;
      await this.companySubscriptionRepository.save(currentSubscription);
    }

    const newSubscription = await this.subscriptionRepository.findOne({
      where: { id: newSubscriptionId },
    });

    if (!newSubscription) {
      throw new BadRequestException('Subscription not found');
    }

    const companySubscription = new CompanySubscription();

    if (isPaymentPromised) {
      companySubscription.status = SubscriptionStatus.PENDING;
      companySubscription.startDate = new Date();
      companySubscription.endDate = new Date();
      companySubscription.endDate.setDate(
        companySubscription.startDate.getDate() + PROMISED_DAYS,
      );
    } else {
      companySubscription.status = SubscriptionStatus.ACTIVE;
      companySubscription.startDate = currentSubscription
        ? new Date(currentSubscription.endDate)
        : new Date();
      companySubscription.endDate =
        period === SubscriptionPeriod.MONTHS
          ? addMonths(companySubscription.startDate, 1)
          : addYears(companySubscription.startDate, 1);
    }

    companySubscription.company = company;
    companySubscription.subscription = newSubscription;

    return this.companySubscriptionRepository.save(companySubscription);
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(id, updateCompanyDto);
    return await this.companyRepository.findOne({ where: { id } });
  }

  async removeCompany(id: string) {
    await this.companyRepository.delete(id);
    return { message: 'Company deleted successfully' };
  }
}
