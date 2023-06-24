import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateModifierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  value: string;
}
