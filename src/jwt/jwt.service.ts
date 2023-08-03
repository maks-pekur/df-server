import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { DecodedToken } from './token.interface';

@Injectable()
export class JwtService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UsersService,
    private readonly jwtService: NestJwtService,
  ) {
    this.logger = new Logger(JwtService.name);
  }

  async generateAccessToken(user: any) {
    const existUser = await this.userService.findOne(user.id);

    const userCompany = existUser.userCompanies.find(
      (userCompany) => userCompany.company.id === user.companyId,
    );

    if (!userCompany) {
      throw new NotFoundException('Company not found for this user');
    }

    const payload = {
      userId: user.id,
      companyId: user.companyId,
      role: userCompany.role.name,
    };
    return this.jwtService.signAsync(payload, { expiresIn: '30m' });
  }

  async generateRefreshToken(user: any) {
    const oldTokens = await this.refreshTokenRepository.find({
      where: { userId: user.id },
    });

    for (const oldToken of oldTokens) {
      oldToken.isRevoked = true;
      await this.refreshTokenRepository.save(oldToken);
    }

    const token = new RefreshToken();

    token.userId = user.id;
    token.isRevoked = false;

    const payload = { userId: user.id, companyId: user.companyId };
    const refreshToken = await this.jwtService.signAsync(payload);

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
      this.logger.warn('Refresh token not found or has been revoked');
      return false;
    }

    const now = new Date();
    if (refreshToken.expiryDate < now) {
      this.logger.warn('Refresh token has expired');
      return false;
    }

    return true;
  }

  async updateAccessToken(token: string) {
    const refreshTokenIsValid = await this.validateRefreshToken(token);

    if (!refreshTokenIsValid) {
      this.logger.warn('Refresh token invalid or expired');
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (refreshToken) {
      const tokenData = this.jwtService.decode(
        refreshToken.token,
      ) as DecodedToken;

      const user = {
        id: tokenData.userId,
        companyId: tokenData.companyId,
      };
      const newAccessToken = await this.generateAccessToken(user);

      return newAccessToken;
    } else {
      this.logger.warn('Refresh token not found in the database');
    }
  }

  async revokeRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
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
