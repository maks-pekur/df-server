import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  code: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop([String])
  imageLinks: string[];
  @Prop()
  additionalInfo: string;
  @Prop()
  sizes: object[];
  @Prop()
  modifiers: object[];
  @Prop()
  fatAmount: number;
  @Prop()
  proteinsAmount: number;
  @Prop()
  carbohydratesAmount: number;
  @Prop()
  energyAmount: number;
  @Prop()
  isDeleted: boolean;
  @Prop([String])
  tags: string[];
  @Prop()
  weight: number;
  @Prop()
  groupId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  productCategoryId: Category;
  @Prop()
  type: string;
  @Prop()
  splittable: boolean;
  @Prop()
  measureUnit: string;
  @Prop()
  seoDescription: string;
  @Prop()
  seoTitle: string;
  @Prop()
  seoText: string;
  @Prop()
  seoKeywords: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
