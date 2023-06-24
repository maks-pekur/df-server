import { DocumentReference } from 'firebase-admin/firestore';

export class CreateProductDto {
  name: string;
  description?: string;
  price: string;
  imageUrl: string;
  extraIngredients?: DocumentReference[];
  ingredientGroups?: DocumentReference[];
  modifierGroupsIds?: DocumentReference[];
  removedIngredients?: DocumentReference[];
  fatAmount?: number;
  proteinsAmount?: number;
  carbohydratesAmount?: number;
  energyAmount?: number;
  tags?: string[];
  measureUnitValue?: number;
  categoryId: DocumentReference;
  measureUnit?: string;
  createdAt: Date;
  updatedAt: Date;
}
