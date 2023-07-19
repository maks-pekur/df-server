import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'image is required' })
  imageUrl: string;

  @IsBoolean()
  isOpen: boolean;
}
