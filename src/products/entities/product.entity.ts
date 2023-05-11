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
  sizes: object[];
  @Prop()
  modifiers: object[];
  @Prop({ defaultValue: 0 })
  fatAmount: number;
  @Prop({ defaultValue: 0 })
  proteinsAmount: number;
  @Prop({ defaultValue: 0 })
  carbohydratesAmount: number;
  @Prop({ defaultValue: 0 })
  energyAmount: number;
  @Prop({ defaultValue: false })
  isDeleted: boolean;
  @Prop([String])
  tags: string[];
  @Prop({ defaultValue: 0 })
  weight: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  productCategoryId: Category;
  @Prop({ defaultValue: 'good' })
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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
