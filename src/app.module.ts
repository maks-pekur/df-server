import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { FirebaseService } from './firebase/firebase.service';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { PopularsModule } from './populars/populars.module';
import { ProductsModule } from './products/products.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { StoriesModule } from './stories/stories.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ModifiersModule } from './modifiers/modifiers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    CategoriesModule,
    CartModule,
    PopularsModule,
    StoriesModule,
    OrdersModule,
    PaymentModule,
    PromoCodesModule,
    RestaurantModule,
    IngredientsModule,
    ModifiersModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
