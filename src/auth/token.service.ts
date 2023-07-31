import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  generateAccessToken(user: IUser) {
    const payload = { id: user.id, userCompanies: user.userCompanies };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: any) {
    const token = new RefreshToken();

    token.userId = user.id;
    token.isRevoked = false;

    const refreshToken = this.jwtService.sign({ id: user.id });

    token.token = refreshToken;

    const expiresIn = 60 * 60 * 24 * 15;
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
    token.expiryDate = expiryDate;

    return await this.refreshTokenRepository.save(token);
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (!refreshToken || refreshToken.isRevoked) {
      return false;
    }

    const now = new Date();
    if (refreshToken.expiryDate < now) {
      return false;
    }

    return true;
  }

  async updateAccessToken(oldRefreshToken: string) {
    const refreshTokenIsValid = await this.validateRefreshToken(
      oldRefreshToken,
    );
    if (!refreshTokenIsValid) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
    });
    const user = await this.userService.findOne(refreshToken.userId);

    const newAccessToken = this.generateAccessToken(user);

    return newAccessToken;
  }

  async cleanupTokens() {
    const now = new Date();
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('expiryDate < :now', { now })
      .execute();
  }
}
