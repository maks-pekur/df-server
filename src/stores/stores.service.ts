import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
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
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {
    this.logger = new Logger(StoresService.name);
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const existStore = await this.storeRepository.findOne({
      where: {
        name: createStoreDto.name,
      },
    });

    if (existStore) {
      throw new BadRequestException('Store already exists');
    }
    return await this.storeRepository.save(createStoreDto);
  }

  async getStores() {
    const stores = await this.storeRepository.find();

    if (!stores.length) {
      throw new BadRequestException('No stores found');
    }

    return stores;
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
    });

    if (!store) {
      throw new BadRequestException('No store found');
    }

    return store;
  }

  async updateStore(id: string, updateStoreDto: UpdateStoreDto) {
    const existStore = await this.storeRepository.findBy({
      name: updateStoreDto.name,
    });

    if (existStore.length) {
      throw new BadRequestException('Store already exists');
    }

    return await this.storeRepository.update(id, updateStoreDto);
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['orders', 'reviews'],
    });

    if (!store) {
      throw new BadRequestException('No store found');
    }

    for (const order of store.orders) {
      order.storeId = null;
      await this.orderRepository.save(order);
    }

    for (const review of store.reviews) {
      review.store = null;
      await this.reviewRepository.save(review);
    }

    return await this.storeRepository.delete(id);
  }
}
