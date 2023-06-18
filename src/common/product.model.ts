export class Product {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  extraIngredients?: string[];
  price: number;
  tags?: string[];
  weight?: number;
  categoryId: string;
  measureUnit?: string;
  carbohydratesAmount?: number;
  fatAmount?: number;
  energyAmount?: number;
  proteinsAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}
