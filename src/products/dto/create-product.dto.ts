export class CreateProductDto {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly imageLinks: string[];
  readonly additionalInfo: string;
  readonly sizes: object[];
  readonly modifiers: object[];
  readonly fatAmount: number;
  readonly proteinsAmount: number;
  readonly carbohydratesAmount: number;
  readonly energyAmount: number;
  readonly isDeleted: boolean;
  readonly tags: string[];
  readonly weight: number;
  readonly groupId: string;
  readonly productCategoryId: string;
  readonly type: string;
  readonly splittable: boolean;
  readonly measureUnit: string;
  readonly seoDescription: string;
  readonly seoTitle: string;
  readonly seoText: string;
  readonly seoKeywords: string;
}
