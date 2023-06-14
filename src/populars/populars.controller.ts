import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePopularDto } from './dto/create-popular.dto';
import { PopularsService } from './populars.service';

@Controller('populars')
export class PopularsController {
  constructor(private readonly popularsService: PopularsService) {}

  @Post()
  async create(@Body() createPopularDto: CreatePopularDto) {
    const popular = await this.popularsService.create(createPopularDto);
    return popular;
  }

  @Get()
  async findAll() {
    const popularProducts = await this.popularsService.findAll();
    return popularProducts;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const popularProduct = await this.popularsService.findOne(id);
    return popularProduct;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.popularsService.remove(id);
  }
}
