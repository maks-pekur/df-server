import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesService.createCategory(createCategoryDto);
    return category;
  }

  @Get()
  findAll() {
    const categories = this.categoriesService.getCategories();
    return categories;
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    const category = this.categoriesService.getCategory(id);
    return category;
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    );
    return category;
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    const category = this.categoriesService.removeCategory(id);
    return category;
  }
}
