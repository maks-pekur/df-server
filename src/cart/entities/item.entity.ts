import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CartItemDocument = HydratedDocument<CartItem>;

@Schema()
export class CartItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop([String])
  imageLinks: string[];

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  subTotalPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(CartItem);
