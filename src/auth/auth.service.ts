import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [
        'userCompanies',
        'userCompanies.company',
        'userCompanies.role',
      ],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(user: IUser) {
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

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
