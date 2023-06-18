export class CreatePaymentDto {
  currency: string;
  amount: number;
  items: [];
  metadata: {
    orderNumber: string;
    customerName: string;
    customerPhoneNumber: string;
  };
}
