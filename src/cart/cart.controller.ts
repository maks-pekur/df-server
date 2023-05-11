import { Controller, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @Post()
  // addCartMenuItem(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.addCartMenuItem(createCartDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
