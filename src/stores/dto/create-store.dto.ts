import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty()
  company: Company;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  description: string;
}
