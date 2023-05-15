import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsArray()
  @IsNotEmpty()
  imageLinks: string[];

  @IsArray()
  sizes: object[];

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

  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  measureUnit: string;

  @IsString()
  @IsOptional()
  seoDescription: string;

  @IsString()
  @IsOptional()
  seoTitle: string;

  @IsString()
  @IsOptional()
  seoText: string;

  @IsString()
  @IsOptional()
  seoKeywords: string;
}
