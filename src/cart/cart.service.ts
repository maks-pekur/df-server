import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from './../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<Cart>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(userId: number | string): Promise<Cart[]> {
    return this.cartModel.find({ userId }).exec();
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new this.cartModel(addToCartDto);
    const user = await this.usersService.findOne(addToCartDto.userId);
    const product = await this.productsService.findOne(addToCartDto.productId);

    cart.userId = user.id;
    cart.productId = product.id;
    cart.name = product.name;
    cart.description = product.description;
    cart.imageLink = product.imageLinks[0];
    // cart.totalPrice = product.price

    return cart.save();
  }

  async updateCount(id: number | string, quantity: number) {
    return await this.cartModel.findByIdAndUpdate(id, { quantity });
  }

  async updateTotalPrice(id: number | string, totalPrice: number) {
    await this.cartModel.findByIdAndUpdate(id, { totalPrice });
  }

  async remove(id: number | string): Promise<void> {
    await this.cartModel.findByIdAndDelete(id);
  }

  async removeAll(userId: number | string): Promise<void> {
    await this.cartModel.deleteMany({ userId });
  }
}
