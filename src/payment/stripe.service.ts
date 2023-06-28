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
      this.logger.warn(
        `Unsupported payment method ${paymentMethod} attempted for order ${orderNumber}`,
      );
      throw new Error('Unsupported payment method');
    }

    this.logger.log(
      `Processing payment for order ${orderNumber} with method ${paymentMethod}`,
    );

    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: this._convertToMinorUnit(amount, currency),
      currency: currency || 'usd',
      description: `Payment for order ${orderNumber}`,
      payment_method_types: [paymentMethod],
      metadata: {
        customer: customerId,
      },
    };

    // If Blik is used, add Blik code
    if (paymentMethod === 'blik') {
      paymentIntentData.payment_method_data = {
        type: 'blik',
        blik: {
          code: blikCode,
        },
      };
      this.logger.log(`Blik code added for payment for order ${orderNumber}`);
    } else {
      // For other payment methods use payment_method_id
      paymentIntentData.payment_method = paymentMethodId;
      paymentIntentData.confirm = true;
      this.logger.log(
        `Payment method ID added for payment for order ${orderNumber}`,
      );
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData,
      );
      this.logger.log(`Payment for order ${orderNumber} has been processed`);
      return paymentIntent;
    } catch (err) {
      this.logger.error(
        `Error processing payment for order ${orderNumber}: ${err.message}`,
      );
      throw err;
    }
  }

  async refundPayment(paymentIntentId: string): Promise<any> {
    this.logger.log(`Processing refund for payment intent ${paymentIntentId}`);

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      this.logger.log(
        `Refund for payment intent ${paymentIntentId} has been processed`,
      );

      return refund;
    } catch (err) {
      this.logger.error(
        `Error refunding payment for payment intent ${paymentIntentId}: ${err.message}`,
      );
      throw err;
    }
  }
}
