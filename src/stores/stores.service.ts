import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import { transliterate } from 'transliteration';
import { EntityManager, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private companyService: CompaniesService,
  ) {}

  async createStore(companyId: string, dto: CreateStoreDto) {
    return await this.entityManager.transaction(async (transactionalEM) => {
      try {
        const existStore = await transactionalEM.findOne(Store, {
          where: {
            name: dto.name,
            company: { id: companyId },
          },
        });

        if (existStore) {
          throw new BadRequestException(
            'Store with this name already exists in the company',
          );
        }

        const slug = dto.slug
          ? dto.slug
          : transliterate(dto.name.toLowerCase()).replace(/[^a-z0-9]+/g, '-');

        const existingStoreWithSlug = await transactionalEM.findOne(Store, {
          where: {
            slug: slug,
            company: { id: companyId },
          },
        });

        if (existingStoreWithSlug) {
          throw new BadRequestException(
            'The generated URL for this store name already exists within the company. Please choose a different name.',
          );
        }

        const newStore = transactionalEM.create(Store, {
          ...dto,
          slug: slug,
          company: { id: companyId },
        });

        const createdStore = await transactionalEM.save(Store, newStore);

        const stopList = new StopList();
        stopList.store = createdStore;
        await transactionalEM.save(StopList, stopList);

        return createdStore;
      } catch (error) {
        this.logger.error(
          `Failed to create store for company ID ${companyId}.`,
        );
        this.logger.error(error.stack);
        throw error;
      }
    });
  }

  async findAll(slug: string) {
    try {
      const company = await this.companyService.findOneBySlug(slug);

      if (!company) {
        throw new NotFoundException(`Company ${slug} not found.`);
      }

      const stores = await this.storeRepository.find({
        where: { company: { id: company.id } },
      });

      if (stores.length === 0) {
        throw new NotFoundException(`The company ${slug} has no stores yet.`);
      }

      return stores;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(companySlug: string, storeSlug: string): Promise<Store> {
    try {
      const company = await this.companyService.findOneBySlug(companySlug);

      if (!company) {
        throw new NotFoundException(`Company ${companySlug} not found.`);
      }

      const store = await this.storeRepository.findOne({
        where: { slug: storeSlug, company: { slug: companySlug } },
        relations: ['orders', 'users'],
      });

      if (!store) {
        throw new NotFoundException(
          `Store ${storeSlug} not found in company ${companySlug}`,
        );
      }

      return store;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStore(
    companyId: string,
    storeSlug: string,
    dto: UpdateStoreDto,
  ): Promise<Store> {
    const currentStore = await this.storeRepository.findOne({
      where: { slug: storeSlug, company: { id: companyId } },
    });

    if (!currentStore) {
      throw new NotFoundException('Store not found');
    }

    let newSlug = dto.slug;

    if (!newSlug && dto.name !== currentStore.name) {
      newSlug = transliterate(dto.name).toLowerCase().replace(/\s+/g, '-');
    }

    if (newSlug) {
      const existingStoreWithNewSlug = await this.storeRepository.findOne({
        where: { slug: newSlug, company: { id: companyId } },
      });

      if (
        existingStoreWithNewSlug &&
        existingStoreWithNewSlug.id !== currentStore.id
      ) {
        throw new BadRequestException(
          'Store with this name (or slug) already exists',
        );
      }

      currentStore.slug = newSlug;
    }

    await this.storeRepository.update(currentStore.id, {
      ...dto,
      slug: currentStore.slug,
    });

    const updatedStore = await this.storeRepository.findOne({
      where: { id: currentStore.id },
    });

    return updatedStore;
  }

  async remove(companyId: string, storeSlug: string) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const store = await transactionalEntityManager.findOne(Store, {
          where: { slug: storeSlug, company: { id: companyId } },
          relations: ['orders', 'reviews', 'stopList'],
        });

        if (!store) {
          throw new NotFoundException('No store found');
        }

        // Disassociate orders from the store
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Order)
          .set({ store: null })
          .where('store = :store', { store: store.id })
          .execute();

        // Delete reviews associated with the store
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Review)
          .where('store = :store', { store: store.id })
          .execute();

        if (store.stopList) {
          await transactionalEntityManager.delete(StopList, store.stopList.id);
        }

        return await transactionalEntityManager.delete(Store, store.id);
      },
    );
  }
}
