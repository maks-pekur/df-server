import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/jwt/entities/refresh-token.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, companyId: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [
        'userCompanies',
        'userCompanies.company',
        'userCompanies.role',
      ],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const userCompany = user.userCompanies.find(
        (userCompany) => userCompany.company.id === companyId,
      );

      if (!userCompany) {
        throw new UnauthorizedException(
          'User does not belong to the given company',
        );
      }

      const { password, userCompanies, ...result } = user;

      return {
        ...result,
        companyId: userCompany.company.id,
        role: userCompany.role.name,
      };
    }
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(user: any) {
    const accessToken = await this.jwtService.generateAccessToken(user);

    const existingRefreshToken = await this.refreshTokenRepository.findOne({
      where: { userId: user.id },
    });

    if (existingRefreshToken) {
      existingRefreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(existingRefreshToken);
    }

    const refreshToken = await this.jwtService.generateRefreshToken(user);

    await this.refreshTokenRepository.save(refreshToken);

    const userForClient = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return {
      accessToken,
      refreshToken,
      user: userForClient,
    };
  }

  async getMe(user: any): Promise<any> {
    const existUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    const { password, ...result } = existUser;

    return result;
  }

  async checkCompanies(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [
        'userCompanies',
        'userCompanies.company',
        'userCompanies.role',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const companiesList = user.userCompanies
      .filter((userCompany) =>
        ['admin', 'staff'].includes(userCompany.role.name),
      )
      .map((userCompany) => ({
        companyId: userCompany.company.id,
        companyName: userCompany.company.name,
        role: userCompany.role.name,
      }));

    if (companiesList.length === 0) {
      throw new ForbiddenException(
        'User does not have access to any companies',
      );
    }

    return companiesList;
  }
}
