import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  subTotalPrice: number;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  items: CartItem[];

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
