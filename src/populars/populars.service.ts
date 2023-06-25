import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class PopularsService {
  constructor(private firebaseService: FirebaseService) {}

  async add(productId: string) {
    try {
      const docRef = await this.firebaseService.popularProductCollection
        .doc('items')
        .get();
      const data = docRef.data();
      if (!data) {
        await this.firebaseService.popularProductCollection
          .doc('items')
          .set({ products: [productId] });
        return 'Product successfully added';
      }
      if (!data.products) data.products = [];

      // Check if product already exists in array
      if (data.products.includes(productId)) {
        throw new ConflictException('Product already exists in popular list');
      }

      data.products.push(productId);
      await this.firebaseService.popularProductCollection
        .doc('items')
        .set(data);
      return 'Product successfully added';
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Product could not be added');
    }
  }

  async findAll() {
    try {
      const docRef = await this.firebaseService.popularProductCollection
        .doc('items')
        .get();
      const data = docRef.data();
      if (!data) {
        return [];
      }
      return data.products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async remove(productId: string) {
    try {
      const docRef = await this.firebaseService.popularProductCollection
        .doc('items')
        .get();
      const data = docRef.data();
      if (!data || !data.products.includes(productId)) {
        throw new NotFoundException('Product does not exist in popular list');
      }
      data.products = data.products.filter((id) => id !== productId);
      await this.firebaseService.popularProductCollection
        .doc('items')
        .set(data);
      return;
    } catch (error) {
      throw new NotFoundException('Product could not be removed');
    }
  }
}
