import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNumberString()
  @IsNotEmpty({
    message: 'Price is required',
  })
  price: number;
}
