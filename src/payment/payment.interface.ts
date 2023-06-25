export interface IPaymentService {
  processPayment(data: any): Promise<any>;
}
