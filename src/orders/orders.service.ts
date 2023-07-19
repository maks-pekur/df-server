import { Inject, Injectable, Logger } from '@nestjs/common';
import { IPaymentService } from 'src/payment/payment.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger: Logger;

  constructor(
    @Inject('PAYMENT_SERVICE')
    private paymentService: IPaymentService,
  ) {
    this.logger = new Logger(OrdersService.name);
  }

  async createOrder(orderData: CreateOrderDto) {
    // try {
    //   const orderNumber = this.generateOrderNumber();
    //   const currentTime = Timestamp.now();
    //   const newOrder: Order = {
    //     ...orderData,
    //     orderNumber,
    //     orderStatus: orderStatus.PENDING,
    //     paymentStatus: paymentStatus.PENDING,
    //     createdAt: currentTime,
    //     statusUpdates: [{ [orderStatus.PENDING]: currentTime }],
    //     orderItems: orderData.orderItems,
    //   };
    //   const docRef = await this.saveOrder(newOrder);
    //   if (
    //     orderData.paymentMethodType === paymentMethod.CARD ||
    //     orderData.paymentMethodType === paymentMethod.APPLE_PAY ||
    //     orderData.paymentMethodType === paymentMethod.BLIK ||
    //     orderData.paymentMethodType === paymentMethod.GOOGLE_PAY
    //   ) {
    //     try {
    //       this.logger.debug(`Request for order payment executed`);
    //       const paymentResult = await this.paymentService.processPayment({
    //         amount: orderData.totalPrice,
    //         order: orderData.orderNumber,
    //       });
    //       if (paymentResult.status === paymentStatus.SUCCEEDED) {
    //         await docRef.update({ paymentStatus: paymentStatus.PAID });
    //       } else {
    //         await docRef.update({ paymentStatus: paymentStatus.FAILED });
    //         throw new Error('Payment failed');
    //       }
    //     } catch (error) {
    //       await docRef.update({ paymentStatus: paymentStatus.FAILED });
    //       this.logger.error(`Payment processing error: ${error.message}`);
    //     }
    //   }
    //   return {
    //     ...newOrder,
    //     id: docRef.id,
    //   };
    // } catch (error) {
    //   this.logger.error(`Failed to create order: ${error.message}`);
    //   throw new BadRequestException('Order not saved');
    // }
  }

  private async saveOrder(order: Order) {
    // try {
    //   this.logger.debug(`Saving order: ${JSON.stringify(order)}`);
    //   const docRef = await this.firebaseService.ordersCollection.add(order);
    //   this.logger.debug(`Order ${order.orderNumber} saved successfully`);
    //   return docRef;
    // } catch (error) {
    //   this.logger.error(
    //     `Failed to save order: ${JSON.stringify(order)}. Error: ${
    //       error.message
    //     }`,
    //   );
    //   throw new BadRequestException('Order not saved');
    // }
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
    // try {
    //   const querySnapshot = await this.firebaseService.ordersCollection.get();
    //   const orders = querySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   })) as Order[];
    //   return orders;
    // } catch (error) {
    //   throw new NotFoundException('Orders not found');
    // }
  }

  async getOrdersByStore(storeId: string) {
    // try {
    //   const querySnapshot = await this.firebaseService.ordersCollection
    //     // .where('storeId', '==', storeId)
    //     .orderBy('createdAt')
    //     .get();
    //   const orders: Order[] = [];
    //   querySnapshot.forEach((orderDoc) => {
    //     if (orderDoc.exists) {
    //       const orderData = orderDoc.data() as Order;
    //       orders.push(orderData);
    //     }
    //   });
    //   return orders;
    // } catch (error) {
    //   throw new NotFoundException('Orders not found');
    // }
  }

  async getOrder(orderId: string) {
    // try {
    //   const orderRef = this.firebaseService.productsCollection.doc(orderId);
    //   const orderSnapshot = await orderRef.get();
    //   if (!orderSnapshot.exists) {
    //     throw new NotFoundException('Order not found');
    //   }
    //   const order: Order = {
    //     id: orderSnapshot.id,
    //     ...orderSnapshot.data(),
    //   } as Order;
    //   return order;
    // } catch (error) {
    //   throw new NotFoundException('Order not found');
    // }
  }
}
