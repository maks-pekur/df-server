import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existCategory) {
      throw new BadRequestException('Category already exists');
    }
    const newCategory = {
      name: createCategoryDto.name,
      slug: slugify(createCategoryDto.name, { lower: true }),
    };
    return await this.categoryRepository.save(newCategory);
  }

  async getCategories() {
    const categories = await this.categoryRepository.find();

    if (!categories.length) {
      throw new NotFoundException('Categories not found');
    }

    return categories;
  }

  async getCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: updateCategoryDto.name },
    });

    if (existCategory && existCategory.id !== id) {
      throw new BadRequestException('Category already exists');
    }

    await this.categoryRepository.update(id, {
      ...updateCategoryDto,
      slug: slugify(updateCategoryDto.name, { lower: true }),
    });

    return this.getCategory(id);
  }

  async removeCategory(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category was not removed');
    }

    await this.categoryRepository.delete(id);

    return { message: 'Category removed successfully' };
  }
}
