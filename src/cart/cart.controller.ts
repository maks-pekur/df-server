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
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getAll(@Param('id') userId: number | string) {
    return this.cartService.findAll(userId);
  }

  // @UseGuards(AuthenticatedGuard)
  @Post('/add')
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.add(addToCartDto);
  }

  // @UseGuards(AuthenticatedGuard)
  @Patch('/qty/:id')
  updateCount(
    @Param('id') productId: number | string,
    @Body() { quantity }: { quantity: number },
  ) {
    return this.cartService.updateCount(productId, quantity);
  }

  // @UseGuards(AuthenticatedGuard)
  @Patch('/total-price/:id')
  updateTotalPrice(
    @Param('id') productId: number | string,
    @Body() totalPrice: number,
  ) {
    return this.cartService.updateTotalPrice(productId, totalPrice);
  }

  // @UseGuards(AuthenticatedGuard)
  @Delete('/one/:id')
  removeOne(@Param('id') id: number | string) {
    return this.cartService.remove(id);
  }

  // @UseGuards(AuthenticatedGuard)
  @Delete('/all/:id')
  removeAll(@Param('id') userId: number | string) {
    return this.cartService.removeAll(userId);
  }
}
