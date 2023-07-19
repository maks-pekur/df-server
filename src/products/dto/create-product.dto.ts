import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @IsNotEmpty({
    message: 'Price is required',
  })
  price: number;

  @IsString()
  imageUrl: string;

  @IsString()
  @IsNotEmpty({
    message: 'Category is required',
  })
  categoryId: string;

  @IsNumber()
  @IsOptional()
  proteinAmount: number;

  @IsNumber()
  @IsOptional()
  carbohydrateAmount: number;

  @IsNumber()
  @IsOptional()
  fatAmount: number;

  @IsNumber()
  @IsOptional()
  energyAmount: number;

  @IsNumber()
  @IsOptional()
  caloriesAmount: number;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  measureUnitValue: string;

  @IsString()
  @IsOptional()
  measureUnit: string;

  // extraIngredients?: string;
  // ingredientGroups?: string[];
  // modifierGroupsIds?: string[];
  // removedIngredients?: string[];
}
