import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { addDays, addMonths, addYears } from 'date-fns';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import {
  SubscriptionPeriod,
  SubscriptionStatus,
} from 'src/subscriptions/interfaces';
import { UserCompany } from 'src/users/entities/user-company.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanySubscription } from './entities/company-subscription.entity';
import { Company } from './entities/company.entity';

const PROMISED_DAYS = 3;

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          const company = this.companyRepository.create(createCompanyDto);

          const savedCompany = await transactionalEntityManager.save(
            Company,
            company,
          );

          const subscription = await transactionalEntityManager.findOne(
            Subscription,
            {
              where: { id: createCompanyDto.subscriptionId },
            },
          );

          if (!subscription) {
            this.logger.warn(
              `Subscription with ID ${createCompanyDto.subscriptionId} not found.`,
            );
            throw new BadRequestException('Subscription not found');
          }

          const companySubscription = new CompanySubscription();
          companySubscription.company = savedCompany;
          companySubscription.subscription = subscription;
          companySubscription.startDate = new Date();
          companySubscription.endDate = addDays(new Date(), 7);
          companySubscription.status = SubscriptionStatus.TRIAL;

          await transactionalEntityManager.save(
            CompanySubscription,
            companySubscription,
          );

          return savedCompany;
        } catch (error) {
          this.logger.error(
            `Error when trying to create company: ${error.message}`,
          );
          throw new InternalServerErrorException(error.message);
        }
      },
    );
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

  async findOneBySlug(slug: string) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .select(['company.id', 'company.name', 'company.description'])
        .leftJoin('company.stores', 'stores')
        .addSelect([
          'stores.id',
          'stores.name',
          'stores.description',
          'stores.slug',
        ])
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
        .where('LOWER(company.slug) = LOWER(:slug)', { slug })
        .getOne();

      if (!company) {
        this.logger.warn(`Company with slug ${slug} not found.`);
        throw new NotFoundException(`Company with slug ${slug} not found`);
      }

      return company;
    } catch (error) {
      this.logger.error(
        `Error when trying to find company with slug ${slug}: ${error.message}`,
      );
      throw new NotFoundException(error.message);
    }
  }

  async findOneById(id: string) {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });
      return company;
    } catch (error) {
      this.logger.error(
        `Error when trying to find company with id ${id}: ${error.message}`,
      );
      throw new NotFoundException(error.message);
    }
  }

  async updateSubscription(
    slug: string,
    newSubscriptionId: string,
    isPaymentPromised: boolean,
    period: SubscriptionPeriod,
  ): Promise<CompanySubscription> {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          const company = await transactionalEntityManager.findOne(Company, {
            where: { slug },
          });

          if (!company) {
            this.logger.warn(`Company with slug ${slug} not found`);
            throw new BadRequestException('Company not found');
          }

          const currentSubscription = await transactionalEntityManager.findOne(
            CompanySubscription,
            {
              where: [
                {
                  company: { id: company.id },
                  status: SubscriptionStatus.ACTIVE,
                },
                {
                  company: { id: company.id },
                  status: SubscriptionStatus.TRIAL,
                },
              ],
            },
          );

          if (currentSubscription) {
            currentSubscription.status = SubscriptionStatus.EXPIRED;
            await transactionalEntityManager.save(
              CompanySubscription,
              currentSubscription,
            );
          }

          const newSubscription = await transactionalEntityManager.findOne(
            Subscription,
            {
              where: { id: newSubscriptionId },
            },
          );

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

          return await transactionalEntityManager.save(
            CompanySubscription,
            companySubscription,
          );
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      },
    );
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
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const company = await transactionalEntityManager.findOne(Company, {
          where: { id },
          relations: [
            'stores',
            'userCompanies',
            'categories',
            'products',
            'subscriptions',
          ],
        });

        if (!company) {
          this.logger.warn(`Company with ID ${id} not found for deletion.`);
          throw new NotFoundException('Company not found');
        }

        const userCompanyIds = company.userCompanies.map((uc) => uc.id);
        if (userCompanyIds.length > 0) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(UserCompany)
            .whereInIds(userCompanyIds)
            .execute();
        }

        const categoryIds = company.categories.map((category) => category.id);
        if (categoryIds.length > 0) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Category)
            .whereInIds(categoryIds)
            .execute();
        }

        const productIds = company.products.map((product) => product.id);
        if (productIds.length > 0) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Product)
            .whereInIds(productIds)
            .execute();
        }

        const subscriptionIds = company.subscriptions.map((sub) => sub.id);
        if (subscriptionIds.length > 0) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(CompanySubscription)
            .whereInIds(subscriptionIds)
            .execute();
        }

        const storeIds = company.stores.map((store) => store.id);
        if (storeIds.length > 0) {
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Store)
            .whereInIds(storeIds)
            .execute();
        }

        await transactionalEntityManager.delete(Company, id);

        return { message: 'Company deleted successfully' };
      },
    );
  }
}
