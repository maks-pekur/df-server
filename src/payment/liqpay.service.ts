import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IPaymentService } from './payment.interface';

@Injectable()
export class LiqPayService implements IPaymentService {
  private liqPay: any;
  private readonly logger = new Logger(LiqPayService.name);

  constructor(private configService: ConfigService) {
    // this.liqPay = new LiqPay(
    //   this.configService.get<string>('LIQPAY_PUBLIC_KEY'),
    //   this.configService.get<string>('LIQPAY_PRIVATE_KEY'),
    // );
  }

  async processPayment(data: any): Promise<any> {
    const { amount, currency, orderNumber, customerId } = data;

    try {
      const payment = this.liqPay.api('request', {
        action: 'pay',
        version: 3,
        amount: amount,
        currency: currency || 'USD',
        description: `Оплата заказа ${orderNumber}`,
        order_id: orderNumber,
        sandbox: 1, // Установите в 0 для реального платежа
      });
      return payment;
    } catch (err) {
      this.logger.error(
        `Error processing payment for order ${orderNumber}: ${err.message}`,
      );
      throw err;
    }
  }
}
