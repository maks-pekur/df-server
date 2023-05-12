import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PopularDocument = HydratedDocument<Popular>;

@Schema()
export class Popular {
  @Prop()
  name: string;
}
export const PopularSchema = SchemaFactory.createForClass(Popular);
