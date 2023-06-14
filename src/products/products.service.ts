import { Injectable, NotFoundException } from '@nestjs/common';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private firebaseService: FirebaseService) {}

  async addProduct(createProductDto: CreateProductDto): Promise<void> {
    try {
      await addDoc(this.firebaseService.productsCollection, createProductDto);
    } catch (error) {
      throw new NotFoundException('Product does not create');
    }
  }

  async getAllProducts(): Promise<any> {
    try {
      const data = await getDocs(this.firebaseService.productsCollection);
      const products = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async getOneProduct(id: string): Promise<any> {
    try {
      const product = await getDoc(
        doc(this.firebaseService.productsCollection, id),
      );
      if (!product) return null;
      return product.data();
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    try {
      const docRef = await setDoc(
        doc(this.firebaseService.productsCollection, id),
        updateProductDto,
      );
      return docRef;
    } catch (error) {
      throw new NotFoundException('Product does not update');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await deleteDoc(
        doc(this.firebaseService.productsCollection, id),
      );
      return product;
    } catch (error) {
      throw new NotFoundException('Product does not remove');
    }
  }
}
