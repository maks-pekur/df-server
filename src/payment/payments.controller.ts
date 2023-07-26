import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IPaymentService } from './payment.interface';

@Controller('payments')
@UseGuards(JwtAuthGuard)
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
