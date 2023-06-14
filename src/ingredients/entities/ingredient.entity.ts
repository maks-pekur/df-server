export class Ingredient {
  id?: string;
  title: string;
  price: number;
  imageUrl: string;
  selected: boolean;
  groupId?: string[];
}

export class IngredientGroup {
  id?: string;
  name: string;
  ingredients?: string[];
}
