import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsOptional()
  comment: string;

  @IsNumberString()
  @IsNotEmpty()
  tasteRating: number;

  @IsNumberString()
  @IsNotEmpty()
  serviceRating: number;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  storeId: string;
}
