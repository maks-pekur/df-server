import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { OTP } from './entities/otp.entity';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([OTP, User])],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
