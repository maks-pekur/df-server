import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from 'src/categories/categories.module';
import { CustomersService } from 'src/customers/customers.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StripeService } from 'src/payment/stripe.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ConfigModule, CategoriesModule],
  controllers: [OrdersController],
  providers: [OrdersService, FirebaseService, CustomersService, StripeService],
})
export class OrdersModule {}
