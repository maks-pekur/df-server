export class CartItemDto {
  readonly customerId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly totalDiscount: number;
  readonly totalWithDiscount: number;
  readonly subTotalPrice: number;
}
