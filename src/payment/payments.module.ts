import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { LiqPayService } from './liqpay.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [PaymentsController],
  providers: [
    StripeService,
    LiqPayService,
    {
      provide: 'PAYMENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const paymentServiceType = configService.get('PAYMENT_SERVICE');
        if (paymentServiceType === 'stripe') {
          return new StripeService(configService);
        } else if (paymentServiceType === 'liqpay') {
          return new LiqPayService(configService);
        } else {
          throw new Error(
            `Unsupported payment service type: ${paymentServiceType}`,
          );
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PAYMENT_SERVICE'],
})
export class PaymentsModule {}
