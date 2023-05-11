import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getAll(@Param('id') userId: string) {
    return this.cartService.findAll(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/add')
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.add(addToCartDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/count/:id')
  updateCount(
    @Body() { count }: { count: number },
    @Param('id') partId: string,
  ) {
    return this.cartService.updateCount(count, partId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/total-price/:id')
  updateTotalPrice(
    @Body() { totalPrice }: { totalPrice: number },
    @Param('id') partId: string,
  ) {
    return this.cartService.updateTotalPrice(totalPrice, partId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/one/:id')
  removeOne(@Param('id') partId: string) {
    return this.cartService.remove(partId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/all/:id')
  removeAll(@Param('id') userId: string) {
    return this.cartService.removeAll(userId);
  }
}
