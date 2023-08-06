import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { RefreshToken } from 'src/jwt/entities/refresh-token.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';
import { OTP } from 'src/sms/entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { SmsService } from './../sms/sms.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    UsersModule,
    JwtModule,
    TypeOrmModule.forFeature([User, RefreshToken, OTP]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtService, SmsService],
  controllers: [AuthController],
})
export class AuthModule {}
