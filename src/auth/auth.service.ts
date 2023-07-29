import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(user: IUser) {
    const tokens = await this.issueTokenPair(user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid token or expired!');

    const user = await this.usersRepository.findOne({
      where: { id: result.id },
    });

    const tokens = await this.issueTokenPair(user);

    return {
      id: user.id,
      ...tokens,
    };
  }

  async issueTokenPair(user: IUser) {
    const payload = { id: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15d',
    });
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });

    return { accessToken, refreshToken };
  }
}
