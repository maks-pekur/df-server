export enum paymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
}

export class Payment {
  paymentInfo: {
    paymentMethod: string;
    paymentStatus: paymentStatus;
    paymentAmount: number;
    paymentDate: Date;
    paymentIntentId: string;
  };
}
