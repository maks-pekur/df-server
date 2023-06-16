import { Injectable, NotFoundException } from '@nestjs/common';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { CustomersService } from 'src/customers/customers.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private firebaseService: FirebaseService,
    private customersService: CustomersService,
  ) {}

  async createOrder(orderData: any): Promise<Order> {
    const orderNumber = this.generateOrderNumber();

    const { customerId } = orderData;
    const customer = await this.customersService.getCustomer(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    } else {
      const currentTime = serverTimestamp();
      const newOrder: Order = {
        orderNumber,
        customerName: customer.name,
        customerPhoneNumber: customer.phoneNumber,
        createdAt: currentTime,
        updatedAt: currentTime,
        ...orderData,
      };

      await addDoc(this.firebaseService.ordersCollection, newOrder);
      return newOrder;
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
}
