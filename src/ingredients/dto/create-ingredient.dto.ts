export class CreateIngredientDto {
  name: string;
  price: string;
  imageUrl: string;
  groupId?: string[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
