import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from './../permissions/permissions.service';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly permissionsService: PermissionsService,
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

  async addPermissionsToSubscription(
    subscriptionId: string,
    permissionIds: string[],
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['permissions'],
    });

    if (!subscription) {
      throw new Error(`Subscription with ID ${subscriptionId} not found`);
    }

    const permissions = await this.permissionsService.findMany(permissionIds);

    permissionIds.forEach((permissionId) => {
      if (!permissions.some((p) => p.id === permissionId)) {
        throw new Error(`Permission with ID ${permissionId} not found`);
      }

      if (subscription.permissions.some((p) => p.id === permissionId)) {
        throw new Error(
          `Permission with ID ${permissionId} is already added to the subscription`,
        );
      }
    });

    subscription.permissions.push(...permissions);
    await this.subscriptionRepository.save(subscription);

    return subscription;
  }

  async update(id: string, subscription: Subscription): Promise<Subscription> {
    await this.subscriptionRepository.update(id, subscription);
    return this.subscriptionRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
