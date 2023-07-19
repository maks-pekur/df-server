import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from 'src/categories/categories.module';
import { CustomersService } from 'src/customers/customers.service';
import { PaymentsModule } from 'src/payment/payments.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ConfigModule, CategoriesModule, PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, CustomersService],
})
export class OrdersModule {}
