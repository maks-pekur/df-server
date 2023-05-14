import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreatePopularDto } from './dto/create-popular.dto';
import { UpdatePopularDto } from './dto/update-popular.dto';
import { Popular } from './entities/popular.entity';

@Injectable()
export class PopularsService {
  constructor(
    @InjectModel(Popular.name) private popularModel: Model<Popular>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createPopularDto: CreatePopularDto) {
    const newPopular = new this.popularModel(createPopularDto);
    const product = await this.productsService.findOne(
      createPopularDto.productId,
    );

    newPopular.productId = product.id;
    newPopular.name = product.name;
    newPopular.imageLinks = [...product.imageLinks];
    // newPopular.price = product.price;

    return newPopular.save();
  }

  async findAll() {
    return await this.popularModel.find().exec();
  }

  async findOne(id: string | number) {
    return `This action returns a #${id} popular`;
  }

  async update(id: string | number, updatePopularDto: UpdatePopularDto) {
    return `This action updates a #${id} popular`;
  }

  async remove(id: string | number) {
    return `This action removes a #${id} popular`;
  }
}
