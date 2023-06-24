export class Ingredient {
  id?: string;
  name: string;
  price: string;
  imageUrl: string;
  selected: boolean;
  groupId?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class IngredientGroup {
  id?: string;
  name: string;
  ingredients?: string[];
}
