import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payment/payments.module';
import { PopularsModule } from './populars/populars.module';
import { ProductsModule } from './products/products.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    CategoriesModule,
    CartModule,
    PopularsModule,
    StoriesModule,
    OrdersModule,
    PaymentsModule,
    PromoCodesModule,
    RestaurantModule,
    IngredientsModule,
    ModifiersModule,
    CustomersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
