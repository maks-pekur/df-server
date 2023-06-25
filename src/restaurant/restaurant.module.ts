import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RestaurantsController } from './restaurant.controller';
import { RestaurantsService } from './restaurant.service';

@Module({
  imports: [ConfigModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, FirebaseService],
})
export class RestaurantModule {}
