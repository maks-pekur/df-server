import { DocumentReference } from 'firebase-admin/firestore';

export class Modifier {
  id?: string;
  name: string;
  value: any;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ModifierGroup {
  id?: string;
  name: string;
  modifiersIds?: DocumentReference[];
  createdAt: Date;
  updatedAt: Date;
}
