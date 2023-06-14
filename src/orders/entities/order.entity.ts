export enum paymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
}

export enum orderStatus {
  pending = 'pending',
  completed = 'completed',
}

export class OrderedItems {
  productId: string;
  quantity: number;
  price: number;
  lifetime: boolean;
  name: string;
}

export class Order {
  userId: string;
  orderType: string;
  customerAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  customerPhoneNumber: string;
  orderedItems: OrderedItems[];
  paymentInfo: {
    paymentMethod: string;
    paymentStatus: paymentStatus;
    paymentAmount: number;
    paymentDate: Date;
    paymentIntentId: string;
  };
  orderStatus: orderStatus;
  isOrderDelivered: boolean;
  checkoutSessionId: string;
}
