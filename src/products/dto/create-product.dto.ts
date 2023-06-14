import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  imageUrl: string;

  @IsArray()
  @IsOptional()
  modifiers: string[];

  @IsNumber()
  @IsOptional()
  fatAmount: number;

  @IsNumber()
  @IsOptional()
  proteinsAmount: number;

  @IsNumber()
  @IsOptional()
  carbohydratesAmount: number;

  @IsNumber()
  @IsOptional()
  energyAmount: number;

  @IsOptional()
  @IsArray()
  tags: string;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  measureUnit: string;
}
