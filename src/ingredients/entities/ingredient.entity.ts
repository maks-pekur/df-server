import { DocumentReference } from 'firebase-admin/firestore';

export class Ingredient {
  id?: string;
  name: string;
  price: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class IngredientGroup {
  id?: string;
  name: string;
  ingredientsIds?: DocumentReference[];
  createdAt: Date;
  updatedAt: Date;
}
