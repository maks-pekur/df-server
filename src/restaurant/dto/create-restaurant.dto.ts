import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsOptional()
  description: string;
}
