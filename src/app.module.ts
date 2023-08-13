import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { LoggerMiddleware } from './common/utils/logger-middleware';
import { CompaniesModule } from './companies/companies.module';
import { ImagesModule } from './images/images.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { JwtAuthGuard } from './jwt/guards/jwt-auth.guard';
import { JwtModule } from './jwt/jwt.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payment/payments.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PopularsModule } from './populars/populars.module';
import { ProductsModule } from './products/products.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RolesModule } from './roles/roles.module';
import { SmsModule } from './sms/sms.module';
import { StopListsModule } from './stop-lists/stop-lists.module';
import { StoresModule } from './stores/stores.module';
import { StoriesModule } from './stories/stories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
    ReviewsModule,
    StopListsModule,
    CompaniesModule,
    SubscriptionsModule,
    PermissionsModule,
    RolesModule,
    JwtModule,
    SmsModule,
    ImagesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
