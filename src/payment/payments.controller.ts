import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from 'src/payment/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/process')
  async processPayment(@Body() body: any) {
    const paymentIntent = await this.stripeService.processPayment(body);
    return paymentIntent;
  }
}
