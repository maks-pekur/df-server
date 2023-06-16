import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:customerId')
  async get(@Param('customerId') customerId: string) {
    const cart = await this.cartService.getCartByCustomerId(customerId);
    return cart;
  }

  @Post('/')
  async addItemToCart(@Body() body: CartItemDto) {
    await this.cartService.addItemToCart(body);
    return { message: 'Product successfully added to cart' };
  }

  @Delete('/')
  async removeItemFromCart(@Body() body) {
    await this.cartService.removeItemFromCart(body);
    return { message: 'Item successfully removed from cart' };
  }

  @Delete('/:customerId')
  async deleteCart(@Param('customerId') customerId: string) {
    await this.cartService.deleteCart(customerId);
    return { message: 'Cart successfully deleted' };
  }
}
