import { DocumentData, DocumentReference } from 'firebase/firestore';

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
  createdAt: any;
  updatedAt: any;
}
