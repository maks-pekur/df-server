import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from 'src/payment/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/process')
  async processPayment(@Body() requestBody: any) {
    const { amount, currency } = requestBody;
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
    );
    // Return the payment intent or perform additional actions
  }
}
