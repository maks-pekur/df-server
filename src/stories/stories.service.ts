import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(@InjectModel(Story.name) private storyModel: Model<Story>) {}

  create(createStoryDto: CreateStoryDto) {
    return 'This action adds a new story';
  }

  findAll() {
    return this.storyModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} story`;
  }

  update(id: number, updateStoryDto: UpdateStoryDto) {
    return `This action updates a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
