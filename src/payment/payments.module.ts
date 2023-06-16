import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StripeService } from 'src/payment/stripe.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController],
  providers: [FirebaseService, StripeService],
})
export class PaymentsModule {}
