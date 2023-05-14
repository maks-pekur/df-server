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

  async create(createPopularDto: CreatePopularDto) {
    return 'This';
  }

  async findAll() {
    return await this.popularModel.find().exec();
  }

  async findOne(id: number) {
    return `This action returns a #${id} popular`;
  }

  async update(id: number, updatePopularDto: UpdatePopularDto) {
    return `This action updates a #${id} popular`;
  }

  async remove(id: number) {
    return `This action removes a #${id} popular`;
  }
}
