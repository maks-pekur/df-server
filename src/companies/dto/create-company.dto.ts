import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  description: string;
}
