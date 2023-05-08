import { Injectable } from '@nestjs/common';
import { AnyObject } from 'mongoose';
import { AddCartMenuItemDto } from './dto/add-cart.dto';

@Injectable()
export class CartService {
  async addCartMenuItem(user: AnyObject, payload: AddCartMenuItemDto) {
    return 'This action adds a new cart';
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
