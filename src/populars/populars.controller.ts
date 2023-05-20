import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePopularDto } from './dto/create-popular.dto';
import { UpdatePopularDto } from './dto/update-popular.dto';
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
  findAll() {
    return this.popularsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.popularsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePopularDto: UpdatePopularDto) {
    return this.popularsService.update(+id, updatePopularDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.popularsService.remove(+id);
  }
}
