import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop()
  userId: string;

  @Prop()
  productId: string;

  @Prop()
  name: string;

  @Prop()
  productCategoryId: string;

  @Prop()
  imageLink: string;

  @Prop()
  count: number;

  @Prop()
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
