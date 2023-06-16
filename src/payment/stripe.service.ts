import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common/config.model';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripeClient: Stripe;

  constructor(private configService: ConfigService<Config>) {
    this.stripeClient = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async createPaymentIntent(
    currency: string,
    amount: number,
  ): Promise<Stripe.PaymentIntent> {
    if (!currency || amount < 1) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }

    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        // Total amount to be sent is converted to cents to be used by the Stripe API
        amount: Number(amount) * 100,
        currency: this.configService.get<string>('STRIPE_CURRENCY'),
        payment_method_types: ['card', 'klarna', 'alipay'],
        metadata: { orderId: currency },
      };

      return await this.stripeClient.paymentIntents.create(paymentIntentParams);
    } catch (error) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
  }
}
