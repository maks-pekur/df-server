import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return newProduct.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllProducts(): Promise<Product[]> {
    try {
      return this.productModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findOneProduct(id: string): Promise<Product> {
    try {
      return this.productModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      return this.productModel.findByIdAndUpdate({ _id: id }, updateProductDto);
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(id: string) {
    try {
      return this.productModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
