import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { RolesGuard } from './guard/roles.guard';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payment/payments.module';
import { PopularsModule } from './populars/populars.module';
import { ProductsModule } from './products/products.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { StoresModule } from './stores/stores.module';
import { StoriesModule } from './stories/stories.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoriesModule,
    CartModule,
    PopularsModule,
    StoriesModule,
    OrdersModule,
    PaymentsModule,
    PromoCodesModule,
    StoresModule,
    IngredientsModule,
    ModifiersModule,
    AuthModule,
    UsersModule,
    FilesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
