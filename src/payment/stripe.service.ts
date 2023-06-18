import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async processPayment(paymentData: any): Promise<Stripe.PaymentIntent> {
    const { paymentMethodType, currency, amount } = paymentData;
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method_types: [paymentMethodType],
      });

      return paymentIntent;
    } catch (error) {
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
  }
}
