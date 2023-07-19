import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    this.logger = new Logger(ProductsService.name);
  }

  async getAllProducts() {
    const products = await this.productRepository.find();

    if (!products.length) {
      throw new NotFoundException('No products found');
    }

    return products;
  }

  async getOneProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('No product found');
    }
    return product;
  }

  async createProduct(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ) {
    // if (!file) {
    //   throw new BadRequestException('Image file required');
    // }

    const existProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existProduct) {
      throw new BadRequestException('Category already exists');
    }

    return await this.productRepository.save(createProductDto);
  }

  async updateProduct(
    id: string,
    file: Express.Multer.File,
    updateProductDto: UpdateProductDto,
  ) {
    const existProduct = await this.productRepository.findOne({
      where: { name: updateProductDto.name },
    });

    if (existProduct) {
      throw new BadRequestException('Category already exists');
    }

    return await this.productRepository.update(id, updateProductDto);
  }

  async removeProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('No product found');
    }

    return await this.productRepository.delete(id);
  }
}
