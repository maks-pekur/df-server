import {
  orderItem,
  orderStatus,
  orderType,
  paymentMethod,
  paymentStatus,
} from 'src/types';

export class CreateOrderDto {
  customerId: string;
  storeId: string;
  orderType: orderType;
  paymentMethodType: paymentMethod;
  totalPrice: number;
  orderItems: orderItem[];
  orderNumber: string;
  orderStatus: orderStatus;
  paymentStatus: paymentStatus;
}
