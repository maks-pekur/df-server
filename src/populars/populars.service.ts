import { Injectable, NotFoundException } from '@nestjs/common';
import { addDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePopularDto } from './dto/create-popular.dto';

@Injectable()
export class PopularsService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createPopularProductDto: CreatePopularDto) {
    try {
      const product = await addDoc(
        this.firebaseService.popularProductCollection,
        createPopularProductDto,
      );
      return product;
    } catch (error) {
      throw new NotFoundException('Product does not create');
    }
  }

  async findAll() {
    try {
      const data = await getDocs(this.firebaseService.popularProductCollection);
      const products = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async findOne(id: string) {
    try {
      const product = await getDoc(
        doc(this.firebaseService.popularProductCollection, id),
      );
      return { ...product.data(), id: product.id };
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async remove(id: string) {
    try {
      const product = await deleteDoc(
        doc(this.firebaseService.popularProductCollection, id),
      );
      return product;
    } catch (error) {
      throw new NotFoundException('Product does not remove');
    }
  }
}
