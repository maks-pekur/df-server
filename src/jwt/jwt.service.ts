import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { EntityManager, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { DecodedToken } from './interfaces';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectEntityManager() private readonly entityManager: EntityManager,

    private readonly userService: UsersService,
    private readonly jwtService: NestJwtService,
  ) {}

  async generateAccessToken(user: any): Promise<string> {
    const existUser = await this.userService.findOne(user.id).catch((err) => {
      this.logger.error(err);
      return null;
    });

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

  async generateRefreshToken(
    user: any,
    userAgent: string,
  ): Promise<RefreshToken> {
    return await this.entityManager.transaction(async (transactionalEM) => {
      try {
        const refreshTokenRepository =
          transactionalEM.getRepository(RefreshToken);

        const existingToken = await refreshTokenRepository.findOne({
          where: {
            userId: user.id,
            userAgent: userAgent,
            isRevoked: false,
          },
        });

        if (existingToken) {
          return existingToken;
        }

        const oldTokens = await refreshTokenRepository.find({
          where: { userId: user.id },
        });

        for (const oldToken of oldTokens) {
          oldToken.isRevoked = true;
          await refreshTokenRepository.save(oldToken);
        }

        const token = new RefreshToken();
        token.userId = user.id;
        token.isRevoked = false;
        token.userAgent = userAgent;

        const payload = { userId: user.id, companyId: user.companyId };
        const refreshToken = await this.jwtService.signAsync(payload);

        token.token = refreshToken;

        const expiresIn = 60 * 60 * 24 * 15;
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
        token.expiryDate = expiryDate;

        return await refreshTokenRepository.save(token);
      } catch (error) {
        this.logger.error(
          `Failed to generate refresh token for user ID ${user.id}.`,
        );
        this.logger.error(error.stack);
        throw error;
      }
    });
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
    const refreshToken = await this.refreshTokenRepository
      .findOne({
        where: { token },
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
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
