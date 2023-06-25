import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { CustomersService } from 'src/customers/customers.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IPaymentService } from 'src/payment/payment.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  Order,
  orderStatus,
  paymentMethod,
  paymentStatus,
} from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger: Logger;

  constructor(
    private firebaseService: FirebaseService,
    private customersService: CustomersService,
    @Inject('PAYMENT_SERVICE')
    private paymentService: IPaymentService,
  ) {
    this.logger = new Logger(OrdersService.name);
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    try {
      const orderNumber = this.generateOrderNumber();

      const { customerId } = orderData;
      const customer = await this.customersService.getCustomer(customerId);

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const currentTime = new Date();

      const newOrder: Order = {
        orderNumber,
        customerName: customer.name || null,
        customerPhoneNumber: customer.phoneNumber,
        orderStatus: orderStatus.PENDING,
        statusUpdates: [{ [orderStatus.PENDING]: currentTime }],
        paymentStatus: paymentStatus.PENDING,
        createdAt: currentTime,
        ...orderData,
      };

      if (
        orderData.paymentMethodType === paymentMethod.CARD ||
        orderData.paymentMethodType === paymentMethod.APPLE_PAY ||
        orderData.paymentMethodType === paymentMethod.BLIK ||
        orderData.paymentMethodType === paymentMethod.GOOGLE_PAY
      ) {
        const paymentResult = await this.paymentService.processPayment({
          currency: orderData.currency,
          paymentMethodType: orderData.paymentMethodType,
          amount: orderData.totalPrice,
          orderNumber: orderNumber,
          customerId: customer.id,
        });

        if (paymentResult.status === paymentStatus.SUCCEEDED) {
          newOrder.paymentStatus = paymentStatus.PAID;
        } else {
          throw new Error('Payment failed');
        }

        await this.saveOrder(newOrder);
        return newOrder;
      }

      await this.saveOrder(newOrder);
      return newOrder;
    } catch (error) {
      throw new BadRequestException('Order not saved');
    }
  }

  private async saveOrder(order: Order): Promise<void> {
    try {
      await this.firebaseService.ordersCollection.add(order);
    } catch (error) {
      throw new BadRequestException('Order not saved');
    }
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000);
    const orderNumber = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}-${random}`;
    return orderNumber;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      const orderRef: DocumentReference =
        this.firebaseService.ordersCollection.doc(orderId);

      const timestamp = new Date();
      const statusUpdate = { [status]: timestamp };

      await orderRef.update({ orderStatus: status });
      await orderRef.update({
        statusUpdates: FieldValue.arrayUnion(statusUpdate),
      });
    } catch (error) {
      throw new BadRequestException('Order not found');
    }
  }

  async getOrders(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.ordersCollection.get();
      const orders: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      const ordersRef = this.firebaseService.ordersCollection.where(
        'customerId',
        '==',
        customerId,
      );
      const ordersSnapshot = await ordersRef.get();

      if (ordersSnapshot.empty) {
        return [];
      }

      const orders: Order[] = [];
      ordersSnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        orders.push(order);
      });

      return orders;
    } catch (error) {
      throw new NotFoundException('Orders not found');
    }
  }

  async getOrder(orderId: string): Promise<DocumentData | null> {
    try {
      const orderDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.ordersCollection.doc(orderId).get();
      if (!orderDoc.exists) {
        return null;
      }
      return orderDoc.data();
    } catch (error) {
      throw new NotFoundException('Ingredient not found');
    }
  }
}
