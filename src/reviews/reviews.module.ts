import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    UsersModule,
    OrdersModule,
    StoresModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
