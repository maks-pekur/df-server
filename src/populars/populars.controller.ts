import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PopularsService } from './populars.service';

@Controller('populars')
export class PopularsController {
  constructor(private readonly popularsService: PopularsService) {}

  @Post()
  async add(@Body('productId') productId: string) {
    const popular = await this.popularsService.add(productId);
    return popular;
  }

  @Get()
  async findAll() {
    const popularProducts = await this.popularsService.findAll();
    return popularProducts;
  }

  @Delete(':id')
  async remove(@Param('productId') productId: string) {
    return this.popularsService.remove(productId);
  }
}
