import { CustomerAddress } from 'src/common/customer.model';
import {
  OrderedItems,
  orderStatus,
  orderType,
  paymentMethod,
  paymentStatus,
} from '../entities/order.entity';

export class CreateOrderDto {
  orderNumber: string;
  orderType: orderType;
  customerId: string;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: CustomerAddress;
  orderedItems: OrderedItems[];
  orderStatus: orderStatus;
  currency: string;
  paymentStatus: paymentStatus;
  paymentMethodType: paymentMethod;
  totalPrice: number;
  createdAt: Date;
}
