import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumberString()
  @IsNotEmpty({
    message: 'Price is required',
  })
  price: number;

  @IsArray()
  @IsOptional()
  ingredientsIds: string[];

  @IsNumberString()
  @IsOptional()
  proteinAmount: number;

  @IsNumberString()
  @IsOptional()
  carbohydrateAmount: number;

  @IsNumberString()
  @IsOptional()
  fatAmount: number;

  @IsNumberString()
  @IsOptional()
  caloriesAmount: number;

  @IsArray()
  categories: string[];

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  measureUnit: string;

  @IsString()
  @IsOptional()
  measureUnitValue: string;
}
