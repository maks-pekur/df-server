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
  customerAddress: {
    street: string;
    build: number;
    local: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  orderedItems: OrderedItems[];
  orderStatus: orderStatus;
  currency: string;
  paymentStatus: paymentStatus;
  paymentMethodType: paymentMethod;
  totalPrice: number;
  createdAt: Date;
}
