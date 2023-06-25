import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DocumentData } from 'firebase-admin/firestore';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantsService.createRestaurant(
      createRestaurantDto,
    );
    return restaurant;
  }

  @Get('/')
  async getAllRestaurants(): Promise<DocumentData[]> {
    return this.restaurantsService.getAllRestaurants();
  }

  @Get('/:id')
  async getOneRestaurant(@Param('id') id: string): Promise<DocumentData> {
    const restaurant = await this.restaurantsService.getOneRestaurant(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }
}
