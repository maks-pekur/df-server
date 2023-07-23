import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(@Body() orderData: CreateOrderDto) {
    const order = await this.ordersService.createOrder(orderData);
    return order;
  }

  @Get('/')
  async getAllOrders() {
    const orders = await this.ordersService.getAllOrders();
    return orders;
  }

  @Get('/order/:orderId')
  async findOne(@Param('orderId') orderId: string) {
    const orders = await this.ordersService.findOne(orderId);
    return orders;
  }

  @Post('/:orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ): Promise<void> {
    await this.ordersService.updateOrderStatus(orderId, status);
  }
}
