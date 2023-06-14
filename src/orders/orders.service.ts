import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor() {}

  // create(createOrderDto: CreateOrderDto) {
  //   return 'This action adds a new order';
  // }

  // async findAllByUserId(userId: string) {
  //   const orders = await this.orderModel.findOne({ userId });

  //   if (!orders) {
  //     throw new NotFoundException(`This user doesn't have any orders`);
  //   }

  //   return orders;
  // }

  // async findOne(id: string) {
  //   const order = await this.orderModel.findById(id);

  //   if (!order) {
  //     throw new NotFoundException(`Order under this id doesn't exist`);
  //   }

  //   return order;
  // }

  // update(id: string, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // async remove(id: string) {
  //   const order = await this.orderModel.findByIdAndRemove(id);
  //   return order;
  // }
}
