import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Repository } from 'typeorm';
import { FilesService } from './../files/files.service';
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
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(companyId: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: { company: { id: companyId } },
        relations: ['ingredients', 'ingredientGroups', 'modifierGroups'],
      });

      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getStoreProducts(storeId: string) {
    const store = await this.storesRepository.findOne({
      where: { id: storeId },
      relations: ['products', 'stopList', 'stopList.products'],
    });

    if (!store) {
      throw new Error('Store not found');
    }

    const productsWithStopListInfo = store.products.map((product) => {
      const isProductInStopList = store.stopList.products.some(
        (stopListProduct) => stopListProduct.id === product.id,
      );

      return {
        ...product,
        isProductInStopList,
      };
    });

    return productsWithStopListInfo;
  }

  async findOne(companyId: string, id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { company: { id: companyId }, id: id },
        relations: ['ingredients', 'ingredientGroups', 'modifierGroups'],
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id ${id} not found for the provided companyId ${companyId}`,
        );
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createProduct(dto: CreateProductDto, files: Express.Multer.File[]) {
    const categories = await this.categoryRepository.find({
      where: dto.categoryIds.map((id) => ({ id })),
    });

    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResponse = await this.filesService.upload(
          'products', // folder
          file.buffer, // dataBuffer
          file.originalname, // filename
        );

        const imageUrl = `${this.configService.get<string>(
          'BASE_URL',
        )}/static/img/products/${file.originalname}`;
        imageUrls.push(imageUrl);
      }
    }

    const newProduct = {
      ...dto,
      categories: categories,
      imageUrls: imageUrls,
    };

    return this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, dto);
    return await this.productRepository.save(product);
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.filesService.removeFiles(product.imageUrls);

    product.categories = [];
    await this.productRepository.save(product);

    await this.productRepository.delete(id);
  }
}
