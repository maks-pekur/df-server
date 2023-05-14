import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PopularDocument = HydratedDocument<Popular>;

@Schema()
export class Popular {
  @Prop()
  name: string;
  @Prop()
  productId: string;
  @Prop()
  imageLinks: string;
}
export const PopularSchema = SchemaFactory.createForClass(Popular);
