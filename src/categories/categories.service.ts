import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(companyId: string, dto: CreateCategoryDto) {
    try {
      const existCategory = await this.categoryRepository.findOne({
        where: { name: dto.name, company: { id: companyId } },
      });

      if (existCategory) {
        throw new BadRequestException(
          'Category already exists for the given company',
        );
      }

      const newCategory = this.categoryRepository.create({
        name: dto.name,
        slug: slugify(dto.name, { lower: true }),
        company: { id: companyId },
      });

      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(companyId: string): Promise<Category[]> {
    try {
      const products = await this.categoryRepository.find({
        where: { company: { id: companyId } },
      });

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(companyId: string, categoryId: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, company: { id: companyId } },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${categoryId} not found in company with ID ${companyId}`,
        );
      }

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    companyId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: updateCategoryDto.name },
    });

    if (existCategory && existCategory.id !== categoryId) {
      throw new BadRequestException('Category already exists');
    }

    await this.categoryRepository.update(categoryId, {
      ...updateCategoryDto,
      slug: slugify(updateCategoryDto.name, { lower: true }),
    });

    return this.findOne(companyId, categoryId);
  }

  async remove(companyId: string, categoryId: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, company: { id: companyId } },
      relations: ['company', 'stores', 'products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    for (const store of category.stores) {
      const index = store.categories.findIndex((cat) => cat.id === categoryId);
      if (index > -1) {
        store.categories.splice(index, 1);
        await this.storeRepository.save(store);
      }
    }

    for (const product of category.products) {
      const index = product.categories.findIndex(
        (cat) => cat.id === categoryId,
      );
      if (index > -1) {
        product.categories.splice(index, 1);
        await this.productRepository.save(product);
      }
    }

    category.company = null;
    await this.categoryRepository.save(category);

    return await this.categoryRepository.delete(categoryId);
  }
}
