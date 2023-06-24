import { DocumentData, DocumentReference } from 'firebase-admin/firestore';

export class CartItem {
  productId: string;
  quantity: number;
  subTotalPrice: number;
  totalDiscount: number;
  totalWithDiscount: number;
}

export class Cart {
  id?: string;
  customerId: string;
  docRef: DocumentReference<DocumentData>;
  items: any[];
  totalPrice: number;
  deliveryCost: number;
  loyaltyProgramCoinsRewarded: number;
  loyaltyProgramCoinsSpent: number;
  discount: number;
  paymentMethodType: string;
  orderType: string;
  createdAt: any;
  updatedAt: any;
}
