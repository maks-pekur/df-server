import { Product } from 'src/common/product.model';

export class CreatePaymentDto {
  products: Product[];
  currency: string;
}
