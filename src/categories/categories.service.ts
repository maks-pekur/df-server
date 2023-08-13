import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { transliterate } from 'transliteration';
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
    private companyService: CompaniesService,
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
        slug: transliterate(dto.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/gi, '-'),
        company: { id: companyId },
      });

      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(slug: string): Promise<Category[]> {
    try {
      const company = await this.companyService.findOneBySlug(slug);

      if (!company) {
        throw new NotFoundException(`Company ${slug} not found.`);
      }
      const categories = await this.categoryRepository.find({
        where: { company: { id: company.id } },
        relations: ['products'],
      });

      return categories;
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
      where: { name: updateCategoryDto.name, company: { id: companyId } },
    });

    if (existCategory && existCategory.id !== categoryId) {
      throw new BadRequestException('Category already exists');
    }

    await this.categoryRepository.update(categoryId, {
      ...updateCategoryDto,
      slug: transliterate(updateCategoryDto.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-'),
    });

    return this.findOne(companyId, categoryId);
  }

  async remove(companyId: string, categoryId: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, company: { id: companyId } },
      relations: ['company', 'products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
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
