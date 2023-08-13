import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { options } from './config';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtService } from './jwt.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    NestJwtModule.registerAsync(options()),
    UsersModule,
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
