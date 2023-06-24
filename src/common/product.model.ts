import { DocumentReference } from 'firebase-admin/firestore';

export class Product {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
  categoryId: DocumentReference;
  price: string;
  measureUnitValue?: number;
  measureUnit?: string;
  carbohydratesAmount?: number;
  fatAmount?: number;
  energyAmount?: number;
  proteinsAmount?: number;
  extraIngredients?: DocumentReference[];
  ingredientGroups?: DocumentReference[];
  removedIngredients?: DocumentReference[];
  modifierGroupsIds?: DocumentReference[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
