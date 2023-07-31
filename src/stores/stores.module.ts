import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Store } from './entities/store.entity';
import { StoreController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Review, Order])],
  controllers: [StoreController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
