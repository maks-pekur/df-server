import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/jwt/entities/refresh-token.entity';
import { OTP } from 'src/sms/entities/otp.entity';
import { SmsService } from 'src/sms/sms.service';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, OTP]),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, SmsService, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
