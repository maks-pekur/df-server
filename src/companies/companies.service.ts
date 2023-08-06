import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, addMonths, addYears } from 'date-fns';
import { SubscriptionPeriod, SubscriptionStatus } from 'src/common/types';
import { Store } from 'src/stores/entities/store.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
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
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(CompanySubscription)
    private readonly companySubscriptionRepository: Repository<CompanySubscription>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const companies = await this.companyRepository.find();

      if (!companies) {
        throw new NotFoundException(`Companies not found.`);
      }
      return companies;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(name: string) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .select(['company.id', 'company.name', 'company.description'])
        .leftJoin('company.stores', 'stores')
        .addSelect(['stores.id', 'stores.name', 'stores.description'])
        .leftJoinAndSelect('company.subscriptions', 'subscriptions')
        .leftJoin('subscriptions.subscription', 'subscription')
        .addSelect([
          'subscription.id',
          'subscription.name',
          'subscription.description',
        ])
        .leftJoin('subscription.permissions', 'permissions')
        .addSelect([
          'permissions.id',
          'permissions.name',
          'permissions.description',
        ])
        .where('LOWER(company.name) = LOWER(:name)', { name })
        .getOne();

      if (!company) {
        throw new NotFoundException(`Company with ID ${name} not found.`);
      }

      return company;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSubscription(
    name: string,
    newSubscriptionId: string,
    isPaymentPromised: boolean,
    period: SubscriptionPeriod,
  ): Promise<CompanySubscription> {
    try {
      const company = await this.companyRepository.findOne({
        where: { name },
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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      await this.companyRepository.update(id, updateCompanyDto);
      return await this.companyRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeCompany(id: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['stores'],
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      await Promise.all(
        company.stores.map((store) => this.storeRepository.delete(store.id)),
      );

      await this.companyRepository.delete(id);

      return { message: 'Company deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
