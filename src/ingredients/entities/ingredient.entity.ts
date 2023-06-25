export class Ingredient {
  id?: string;
  name: string;
  price: string;
  imageUrl: string;
  isInStopList?: boolean;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export class IngredientGroup {
  id?: string;
  name: string;
  ingredientsIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
