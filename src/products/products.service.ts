import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { ImagesService } from 'src/images/images.service';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(StopList)
    private stopListRepository: Repository<StopList>,

    private readonly imagesService: ImagesService,
    private readonly companiesService: CompaniesService,
  ) {}

  async createProduct(
    companyId: string,
    dto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    try {
      const company = await this.companiesService.findOneById(companyId);

      if (!company) {
        this.logger.warn('Company not found');
        throw new NotFoundException('Company not found');
      }

      const categories = await this.categoryRepository.find({
        where: dto.categories.map((id) => ({ id })),
      });

      const imageUrl = await this.imagesService.uploadImage('products', file);

      const newProduct = {
        ...dto,
        company: company,
        categories: categories,
        imageUrl: imageUrl,
      };

      const savedProduct = await this.productRepository.save(newProduct);

      return savedProduct;
    } catch (error) {
      this.logger.error('Failed to create product:', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(companySlug: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: { company: { slug: companySlug } },
        relations: ['ingredients', 'ingredientGroups', 'modifierGroups'],
      });

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(companySlug: string, id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: id, company: { slug: companySlug } },
        relations: ['ingredients', 'ingredientGroups', 'modifierGroups'],
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id ${id} not found for the provided company ${companySlug}`,
        );
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findProductsForStore(
    companySlug: string,
    storeSlug: string,
  ): Promise<{ product: Product; isInStopList: boolean }[]> {
    const stopList = await this.stopListRepository.findOne({
      where: { store: { slug: storeSlug } },
      relations: ['products'],
    });

    const products = await this.productRepository.find({
      where: { company: { slug: companySlug } },
    });

    return products.map((product) => ({
      product,
      isInStopList:
        stopList?.products.some((p) => p.id === product.id) ?? false,
    }));
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (file) {
      if (product.imageUrl) {
        await this.imagesService.removeImage(product.imageUrl);
      }

      const imageUrl = await this.imagesService.uploadImage('products', file);
      product.imageUrl = imageUrl;
    }

    if (dto.categories) {
      const categories = await this.categoryRepository.find({
        where: dto.categories.map((id) => ({ id })),
      });
      product.categories = categories;
    }

    Object.assign(product, dto);

    return await this.productRepository.save(product);
  }

  async removeProduct(companyId: string, id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.imageUrl) {
      await this.imagesService.removeImage(product.imageUrl);
    }

    product.categories = [];
    await this.productRepository.save(product);

    await this.productRepository.delete(id);
  }
}
