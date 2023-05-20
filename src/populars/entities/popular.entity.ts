import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';

export type PopularDocument = HydratedDocument<Popular>;

@Schema()
export class Popular {
  @Prop()
  name: string;

  @Prop()
  productId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;

  @Prop([String])
  imageLinks: string[];
}
export const PopularSchema = SchemaFactory.createForClass(Popular);
