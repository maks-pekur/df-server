import { DocumentReference } from 'firebase/firestore';

export class Product {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  extraIngredients: string;
  price: number;
  tags: string;
  weight: number;
  categoryId: DocumentReference;
  measureUnit: string;
  carbohydratesAmount: number;
  fatAmount: number;
  energyAmount: number;
  proteinsAmount: number;
}
