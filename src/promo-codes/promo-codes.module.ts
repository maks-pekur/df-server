import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';

@Module({
  imports: [ConfigModule],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
})
export class PromoCodesModule {}
