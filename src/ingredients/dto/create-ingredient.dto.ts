import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  selected: boolean;

  @IsArray()
  @IsOptional()
  groupId?: string[];
}
