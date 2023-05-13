import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Date })
  birthDay: Date;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);