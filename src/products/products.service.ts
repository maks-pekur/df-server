import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { FilesService } from './../files/files.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getOneProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
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
