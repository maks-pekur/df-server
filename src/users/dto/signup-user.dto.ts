import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  secretToken?: string;
}
