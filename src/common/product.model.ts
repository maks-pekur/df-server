import { DocumentReference } from 'firebase-admin/firestore';

export class Product {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
  extraIngredients?: string[];
  price: string;
  tags?: string[];
  measureUnitValue?: number;
  categoryId: DocumentReference;
  measureUnit?: string;
  carbohydratesAmount?: number;
  fatAmount?: number;
  energyAmount?: number;
  proteinsAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}
