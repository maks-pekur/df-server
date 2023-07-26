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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async findAll(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionsService.findOne(id);
  }

  @Post()
  async create(@Body() subscription: Subscription): Promise<Subscription> {
    return this.subscriptionsService.create(subscription);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() subscription: Subscription,
  ): Promise<Subscription> {
    return this.subscriptionsService.update(id, subscription);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.subscriptionsService.remove(id);
  }
}
