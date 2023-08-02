import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    const category = this.categoriesService.removeCategory(id);
    return category;
  }
}
