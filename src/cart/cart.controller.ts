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
    await this.cartService.addItemToCart(body);
    return { message: 'Product successfully added to cart' };
  }

  @Delete('/')
  async removeItemFromCart(@Body() body) {
    await this.cartService.removeItemFromCart(body);
    return { message: 'Item successfully removed from cart' };
  }

  @Delete('/:id')
  async deleteCart(@Param('id') userId: string) {
    await this.cartService.deleteCart(userId);
    return { message: 'Cart successfully deleted' };
  }
  @Post(':userId/add-promo-code')
  async applyPromoCodeToCart(
    @Param('userId') userId: string,
    @Body('promoCode') promoCode: string,
  ): Promise<void> {
    await this.cartService.applyPromoCodeToCart(userId, promoCode);
  }
}
