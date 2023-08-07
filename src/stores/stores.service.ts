import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
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
    @InjectRepository(StopList)
    private stopListRepository: Repository<StopList>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createStore(companyId: string, dto: CreateStoreDto) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          const existStore = await transactionalEntityManager.findOne(Store, {
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

          const newStore = transactionalEntityManager.create(Store, {
            ...dto,
            company: { id: companyId },
          });

          const createdStore = await transactionalEntityManager.save(
            Store,
            newStore,
          );

          const stopList = new StopList();
          stopList.store = createdStore;
          await transactionalEntityManager.save(StopList, stopList);

          return createdStore;
        } catch (error) {
          this.logger.error(
            `Failed to create store for company ID ${companyId}.`,
          );
          this.logger.error(error.stack);
          throw error;
        }
      },
    );
  }

  async findAll(companyId: string) {
    try {
      const stores = await this.storeRepository
        .createQueryBuilder('store')
        .where('store.companyId = :companyId', { companyId })
        .getMany();

      if (!stores.length) {
        return {
          message: `The company ${companyId} has no stores yet`,
        };
      }

      return stores;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(companyId: string, storeId: string): Promise<Store> {
    try {
      const store = await this.storeRepository.findOne({
        where: { id: storeId, company: { id: companyId } },
      });

      if (!store) {
        throw new NotFoundException(
          `Store with ID ${storeId} not found in company with ID ${companyId}`,
        );
      }

      return store;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateStore(companyId: string, storeId: string, dto: UpdateStoreDto) {
    const existStore = await this.storeRepository.findOne({
      where: { name: dto.name, company: { id: companyId } },
    });

    if (existStore && existStore.id !== storeId) {
      throw new BadRequestException('Store with this name already exists');
    }

    await this.storeRepository.update(storeId, dto);

    const updatedStore = await this.storeRepository.findOne({
      where: { id: storeId, company: { id: companyId } },
    });

    return updatedStore;
  }

  async remove(storeId: string) {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const store = await transactionalEntityManager.findOne(Store, {
          where: { id: storeId },
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
          .where('store = :store', { store: storeId })
          .execute();

        // Disassociate reviews from the store
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Review)
          .set({ store: null })
          .where('store = :store', { store: storeId })
          .execute();

        if (store.stopList) {
          await transactionalEntityManager.delete(StopList, store.stopList.id);
        }

        return await transactionalEntityManager.delete(Store, storeId);
      },
    );
  }
}
