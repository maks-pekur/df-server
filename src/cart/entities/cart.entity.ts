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
  description: string;

  @Prop({ default: 0 })
  price: number;

  @Prop([String])
  imageLinks: string[];

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
