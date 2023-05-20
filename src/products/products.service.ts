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

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return newProduct.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return this.productModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async getOneProduct(id: string): Promise<Product> {
    try {
      return this.productModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    let products = await this.getAllProducts();

    if (category) {
      products = products.filter(
        (product) => product.categoryId.toString() === category,
      );
    }

    return products;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      return this.productModel.findByIdAndUpdate({ _id: id }, updateProductDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }
}
