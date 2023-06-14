import { DocumentData, DocumentReference } from 'firebase/firestore';

export class CartItem {
  productId: string;
  quantity: number;
  subTotalPrice: number;
}

export class Cart {
  id: string;
  userId: string;
  docRef: DocumentReference<DocumentData>;
  items: any[];
  totalPrice: number;
  createdAt: any;
  updatedAt: any;
}
