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
    return this.cartModel.find({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new Cart();
    const user = await this.usersService.findOne(addToCartDto.userId);
    const product = await this.productsService.findOne(addToCartDto.productId);

    cart.userId = user.id;
    cart.productId = product.id;
    cart.name = product.name;

    return cart.save();
  }

  async updateCount(count: number, userId: string) {}
}
