import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IPaymentService } from './payment.interface';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentService: IPaymentService,
  ) {}

  @Post('/process')
  async processPayment(@Body() body: any) {
    const paymentIntent = await this.paymentService.processPayment(body);
    return paymentIntent;
  }
}
