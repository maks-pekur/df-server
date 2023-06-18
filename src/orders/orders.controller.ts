import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create')
  async createOrder(@Body() orderData: any) {
    const createdOrder = await this.ordersService.createOrder(orderData);
    return createdOrder;
  }

  @Post(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ): Promise<void> {
    await this.ordersService.updateOrderStatus(orderId, status);
  }

  @Get()
  async getOrders() {
    const orders = await this.ordersService.getOrders();
    return orders;
  }

  @Get(':customerId')
  async getOrdersByCustomer(@Param('customerId') customerId: string) {
    const orders = await this.ordersService.getOrdersByCustomer(customerId);
    return orders;
  }

  @Get('order/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    const orders = await this.ordersService.getOrder(orderId);
    return orders;
  }
}
