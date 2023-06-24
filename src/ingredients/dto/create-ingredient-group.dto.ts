import { DocumentReference } from 'firebase-admin/firestore';

export class CreateIngredientGroupDto {
  name: string;
  ingredientsIds?: DocumentReference[];
  createdAt: Date;
  updatedAt: Date;
}
