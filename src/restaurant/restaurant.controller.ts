import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/')
  async getRestaurants() {
    const restaurants = await this.restaurantService.getRestaurants();
    return restaurants;
  }

  @Get('/:id')
  async getRestaurant(@Param('id') id: string) {
    const restaurant = await this.restaurantService.getRestaurant(id);
    return restaurant;
  }

  @Post('/add')
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.createRestaurant(
      createRestaurantDto,
    );
    return restaurant;
  }

  @Patch('/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantService.updateRestaurant(
      id,
      updateRestaurantDto,
    );

    return restaurant;
  }

  @Delete('/:id')
  async deleteRestaurant(@Param('id') id: string) {
    const restaurant = await this.restaurantService.deleteRestaurant(id);
    return restaurant;
  }
}
