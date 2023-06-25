import { CustomerAddress } from 'src/customers/customer.model';

export enum orderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum paymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export enum paymentMethod {
  CASH = 'cash',
  CART_ON_DELIVERY = 'card_on_delivery',
  CARD = 'card',
  BLIK = 'blik',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum orderType {
  DELIVERY = 'delivery',
  TAKE_AWAY = 'takeaway',
  INSIDE = 'inside',
}

export class OrderedItems {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
}

export class Order {
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
  createdAt: Date;
  statusUpdates: Array<{ [key in orderStatus]?: Date | null }>;
}
