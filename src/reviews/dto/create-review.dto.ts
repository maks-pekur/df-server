import {
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
  tasteRating: number;

  @IsNumberString()
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
