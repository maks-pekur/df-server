import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find();
  }

  async findOne(id: string): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({ where: { id } });
  }

  async create(subscription: Subscription): Promise<Subscription> {
    return await this.subscriptionRepository.save(subscription);
  }

  async update(id: string, subscription: Subscription): Promise<Subscription> {
    await this.subscriptionRepository.update(id, subscription);
    return this.subscriptionRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
