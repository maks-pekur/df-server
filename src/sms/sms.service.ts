import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore } from 'date-fns';
import { generateOTP } from 'src/common/utils/codeGenerator';
import { getExpiry } from 'src/common/utils/dateTimeUtility';
import { User } from 'src/users/entities/user.entity';
import twilio from 'twilio';
import { Repository } from 'typeorm';
import { OTP } from './entities/otp.entity';

@Injectable()
export class SmsService {
  private client;

  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.client = twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(to: string, message: string) {
    return await this.client.messages.create({
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      to,
      body: message,
    });
  }

  async sendOtp(phoneNumber: string) {
    const verificationCode = generateOTP(6);

    const otp = this.otpRepository.create({
      code: verificationCode,
      expiryDate: getExpiry(),
      phoneNumber,
    });

    await this.otpRepository.save(otp);

    await this.sendSms(
      phoneNumber,
      `Your verification code is ${verificationCode}`,
    );

    return { message: 'OTP sent successfully.' };
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { phoneNumber },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid OTP.');
    }

    if (isBefore(otpRecord.expiryDate, new Date())) {
      throw new UnauthorizedException('OTP has expired.');
    }

    if (otpRecord.code !== code) {
      throw new UnauthorizedException('Invalid OTP.');
    }

    await this.otpRepository.delete(otpRecord.id);

    let user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      user = this.userRepository.create({ phoneNumber, isPhoneVerified: true });
    } else {
      user.isPhoneVerified = true;
    }

    await this.userRepository.save(user);

    return user;
  }
}
