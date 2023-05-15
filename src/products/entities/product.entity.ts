import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  _id: string;

  @Prop()
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop([String])
  imageLinks: string[];

  @Prop()
  sizes: object[];

  @Prop([String])
  modifiers: string[];

  @Prop({ default: 0 })
  fatAmount: number;

  @Prop({ default: 0 })
  proteinsAmount: number;

  @Prop({ default: 0 })
  carbohydratesAmount: number;

  @Prop({ default: 0 })
  energyAmount: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  weight: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  productCategoryId: Category;

  @Prop({ default: 'good' })
  type: string;

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

  @Prop()
  _v: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
