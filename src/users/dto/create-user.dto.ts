import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/types';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  role: UserRole;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  password?: string;
}
