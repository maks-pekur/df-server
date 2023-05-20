import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  async get(@Param('id') id: string) {
    const cart = await this.cartService.getCart(id);
    return cart;
  }

  @Post('/')
  async addItemToCart(@Body() body: CartItemDto) {
    const userId = '6458f0cfb2748e9a47cb72ae';
    const cart = await this.cartService.addItemToCart(userId, body);
    return cart;
  }

  @Delete('/')
  async removeItemFromCart(@Request() req, @Body() { productId }) {
    const userId = req.user.userId;
    const cart = await this.cartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

  @Delete('/:id')
  async deleteCart(@Param('id') userId: string) {
    const cart = await this.cartService.deleteCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
