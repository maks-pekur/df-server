import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async findAll() {
    return await this.subscriptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscriptionsService.findOne(id);
  }

  @Post()
  async create(@Body() subscription: Subscription) {
    return await this.subscriptionsService.create(subscription);
  }

  @Post(':subscriptionId/permissions')
  async addPermissionsToSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body('permissionId') permissionIds: string[],
  ) {
    const subscription =
      await this.subscriptionsService.addPermissionsToSubscription(
        subscriptionId,
        permissionIds,
      );
    return subscription;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() subscription: Subscription) {
    return await this.subscriptionsService.update(id, subscription);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subscriptionsService.remove(id);
  }
}
