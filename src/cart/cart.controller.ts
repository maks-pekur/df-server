import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:id')
  async get(@Param('id') id: string) {
    const cart = await this.cartService.getCartByUserId(id);
    return cart;
  }

  @Post('/')
  async addItemToCart(@Body() body: CartItemDto) {
    const userId = '6458f0cfb2748e9a47cb72ae';
    await this.cartService.addItemToCart(userId, body);
    return { message: 'Product successfully added to cart' };
  }

  @Delete('/')
  async removeItemFromCart(@Body('productId') productId: string) {
    const userId = '6458f0cfb2748e9a47cb72ae';
    await this.cartService.removeItemFromCart(userId, productId);
    return { message: 'Item successfully removed from cart' };
  }

  @Delete('/:id')
  async deleteCart(@Param('id') userId: string) {
    await this.cartService.deleteCart(userId);
    return { message: 'Cart successfully deleted' };
  }
}
