import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngredientGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  ingredientsIds: string[];
}
