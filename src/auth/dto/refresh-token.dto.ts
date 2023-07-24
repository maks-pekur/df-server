import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'You did not provide a valid refresh token' })
  refreshToken: string;
}
