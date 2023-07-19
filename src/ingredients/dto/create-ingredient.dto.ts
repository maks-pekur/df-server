import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  groupId?: string[];
}
