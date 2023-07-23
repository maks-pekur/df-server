import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaymentService } from 'src/payment/payment.interface';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger: Logger;

  constructor(
    @Inject('PAYMENT_SERVICE')
    private paymentService: IPaymentService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.logger = new Logger(OrdersService.name);
  }

  async createOrder(orderData: CreateOrderDto) {
    return 'orders';
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000);
    const orderNumber = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}-${random}`;
    return orderNumber;
  }

  async updateOrderStatus(orderId: string, status: string) {
    // try {
    //   const orderRef: DocumentReference =
    //     this.firebaseService.ordersCollection.doc(orderId);
    //   const timestamp = new Date();
    //   const statusUpdate = { [status]: timestamp };
    //   await orderRef.update({ orderStatus: status });
    //   await orderRef.update({
    //     statusUpdates: FieldValue.arrayUnion(statusUpdate),
    //   });
    // } catch (error) {
    //   throw new BadRequestException('Order not found');
    // }
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find();

    if (!orders.length) {
      throw new NotFoundException('No orders found');
    }
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
