import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';

@Module({
  imports: [ConfigModule],
  controllers: [PromoCodesController],
  providers: [PromoCodesService, FirebaseService],
})
export class PromoCodesModule {}
