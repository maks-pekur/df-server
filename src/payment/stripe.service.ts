import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { IPaymentService } from './payment.interface';

@Injectable()
export class StripeService implements IPaymentService {
  private stripe: Stripe;
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(StripeService.name);
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  private _convertToMinorUnit(amount: number, currency: string): number {
    const zeroDecimalCurrencies = [
      'BIF',
      'CLP',
      'DJF',
      'GNF',
      'JPY',
      'KMF',
      'KRW',
      'MGA',
      'PYG',
      'RWF',
      'UGX',
      'VUV',
      'XAF',
      'XOF',
      'XPF',
    ];
    if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
      return amount; // Возвращаем сумму без изменений для валют без "копеек"
    } else {
      return amount * 100; // Для остальных валют пересчитываем сумму в "копейки"
    }
  }

  async processPayment(data: any): Promise<any> {
    const {
      paymentMethodId,
      amount,
      paymentMethod,
      currency,
      orderNumber,
      customerId,
      blikCode,
    } = data;
    if (!['card', 'blik', 'apple_pay', 'google_pay'].includes(paymentMethod)) {
      throw new Error('Unsupported payment method');
    }

    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: this._convertToMinorUnit(amount, currency),
      currency: currency || 'usd',
      description: `Оплата заказа ${orderNumber}`,
      payment_method_types: [paymentMethod],
      metadata: {
        customer: customerId,
      },
    };

    // Если используется BLIK, добавляем код BLIK
    if (paymentMethod === 'blik') {
      paymentIntentData.payment_method_data = {
        type: 'blik',
        blik: {
          code: blikCode,
        },
      };
    } else {
      // Для других методов оплаты используем payment_method_id
      paymentIntentData.payment_method = paymentMethodId;
      paymentIntentData.confirm = true;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData,
      );

      return paymentIntent;
    } catch (err) {
      this.logger.error(
        `Error processing payment for order ${orderNumber}: ${err.message}`,
      );
      throw err;
    }
  }
}
