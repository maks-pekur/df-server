import { DocumentData, DocumentReference } from 'firebase-admin/firestore';

export class CartItem {
  productId: string;
  quantity: number;
  subTotalPrice: number;
}

export class Cart {
  id: string;
  customerId: string;
  docRef: DocumentReference<DocumentData>;
  items: any[];
  totalPrice: number;
  deliveryCost: number;
  coinCount: number;
  paymentMethodType: string;
  orderType: string;
  createdAt: any;
  updatedAt: any;
}
