import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePopularDto } from './dto/create-popular.dto';

@Injectable()
export class PopularsService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createPopularProductDto: CreatePopularDto) {
    try {
      const docRef = await this.firebaseService.popularProductCollection.add(
        createPopularProductDto,
      );
      return docRef.id;
    } catch (error) {
      throw new BadRequestException('Product does not create');
    }
  }

  async findAll() {
    try {
      const snapshot =
        await this.firebaseService.popularProductCollection.get();
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async findOne(id: string) {
    try {
      const docRef = await this.firebaseService.popularProductCollection
        .doc(id)
        .get();
      if (!docRef.exists) {
        throw new NotFoundException('Product not found');
      }
      return { id: docRef.id, ...docRef.data() };
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async remove(id: string) {
    try {
      await this.firebaseService.popularProductCollection.doc(id).delete();
      return;
    } catch (error) {
      throw new NotFoundException('Product does not remove');
    }
  }
}
