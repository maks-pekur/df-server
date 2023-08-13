import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;
}
