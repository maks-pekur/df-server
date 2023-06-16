import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create')
  async createOrder(@Body() orderData: any) {
    const createdOrder = await this.ordersService.createOrder(orderData);
    return createdOrder;
  }
}
