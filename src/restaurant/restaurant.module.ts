import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [ConfigModule],
  controllers: [RestaurantController],
  providers: [RestaurantService, FirebaseService],
})
export class RestaurantModule {}
