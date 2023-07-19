import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/customer/:customerId')
  async get(@Param('customerId') customerId: string) {
    const cart = await this.cartService.getCartByCustomerId(customerId);
    return cart;
  }

  @Get('/:cartId')
  async getCartById(@Param('cartId') cartId: string) {
    const cart = this.cartService.getCartById(cartId);
    return cart;
  }

  @Patch('/update/:cartId')
  async updateCart(@Param('cartId') cartId: string, @Body() body) {
    await this.cartService.updateCart(cartId, body);
    return { message: 'Cart successfully updated' };
  }

  @Post('/')
  async addItemToCart(@Body() body: CartItemDto) {
    await this.cartService.addItemToCart(body);
    return { message: 'Product successfully added to cart' };
  }

  @Delete('/')
  async removeItemFromCart(@Body() body) {
    await this.cartService.removeItemFromCart();
    return { message: 'Item successfully removed from cart' };
  }

  @Delete('/:customerId')
  async deleteCart(@Param('customerId') customerId: string) {
    await this.cartService.deleteCart(customerId);
    return { message: 'Cart successfully deleted' };
  }
}
