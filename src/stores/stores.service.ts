import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(StopList)
    private stopListRepository: Repository<StopList>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {
    this.logger = new Logger(StoresService.name);
  }

  async createStore(companyId: string, dto: CreateStoreDto) {
    const existStore = await this.storeRepository.findOne({
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

    const newStore = this.storeRepository.create({
      ...dto,
      company: { id: companyId },
    });

    const createdStore = await this.storeRepository.save(newStore);

    const stopList = new StopList();
    stopList.store = createdStore;
    await this.stopListRepository.save(stopList);

    return createdStore;
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
    return await this.storeRepository.manager.transaction(async (manager) => {
      const store = await manager.findOne(Store, {
        where: { id: storeId },
        relations: ['orders', 'reviews'],
      });

      if (!store) {
        throw new BadRequestException('No store found');
      }

      for (const order of store.orders) {
        order.store = null;
        await manager.save(Order, order);
      }

      for (const review of store.reviews) {
        review.store = null;
        await manager.save(Review, review);
      }

      return await manager.delete(Store, storeId);
    });
  }
}
