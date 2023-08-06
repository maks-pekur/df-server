import { IsNumberString, IsString } from 'class-validator';
import { OrderType, PaymentMethod } from 'src/common/types';
import {
  IOrderItem,
  OrderStatus,
  PaymentStatus,
} from '../../common/types/index';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsString()
  storeId: string;

  @IsString()
  orderType: OrderType;

  @IsString()
  paymentMethodType: PaymentMethod;

  @IsNumberString()
  totalPrice: number;

  orderItems: IOrderItem[];

  @IsString()
  orderNumber: string;

  @IsString()
  orderStatus: OrderStatus;

  @IsString()
  paymentStatus: PaymentStatus;
}
