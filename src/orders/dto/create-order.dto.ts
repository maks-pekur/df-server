import { IsNumberString, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from 'src/payment/interfaces';
import { IOrderItem, OrderStatus, OrderType } from '../interfaces';

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
