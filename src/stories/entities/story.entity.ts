import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoryDocument = HydratedDocument<Story>;

@Schema()
export class Story {
  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop()
  isOpen: boolean;
}

export const StorySchema = SchemaFactory.createForClass(Story);
