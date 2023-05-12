import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePopularDto } from './dto/create-popular.dto';
import { UpdatePopularDto } from './dto/update-popular.dto';
import { Popular } from './entities/popular.entity';

@Injectable()
export class PopularsService {
  constructor(
    @InjectModel(Popular.name) private popularModel: Model<Popular>,
  ) {}

  create(createPopularDto: CreatePopularDto) {
    return 'This action adds a new popular';
  }

  findAll() {
    return this.popularModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} popular`;
  }

  update(id: number, updatePopularDto: UpdatePopularDto) {
    return `This action updates a #${id} popular`;
  }

  remove(id: number) {
    return `This action removes a #${id} popular`;
  }
}
