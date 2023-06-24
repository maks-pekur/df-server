export class CreateIngredientDto {
  name: string;
  price: string;
  selected: boolean;
  imageUrl: string;
  groupId?: string[];
  createdAt: Date;
  updatedAt: Date;
}
