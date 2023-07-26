import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsBoolean()
  @IsOptional()
  trialPeriod: boolean;
}
