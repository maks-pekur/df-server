import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesService.create(createCategoryDto);
    return category;
  }

  @Get()
  findAll() {
    const categories = this.categoriesService.findAll();
    return categories;
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    const category = this.categoriesService.findOne(id);
    return category;
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = this.categoriesService.update(id, updateCategoryDto);
    return category;
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    const category = this.categoriesService.remove(id);
    return category;
  }
}
