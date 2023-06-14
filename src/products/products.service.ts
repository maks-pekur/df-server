import { Injectable, NotFoundException } from '@nestjs/common';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { CategoriesService } from 'src/categories/categories.service';
import { Product } from 'src/common/product.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import { imageValidation } from 'src/utils/file-uploading.utils';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private firebaseService: FirebaseService,
    private categoriesService: CategoriesService,
  ) {}

  async addProduct(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<void> {
    try {
      const isValidImage = imageValidation(file.mimetype);
      if (!isValidImage) {
        throw new NotFoundException('Invalid image format');
      }
      const imageUrl = await this.uploadImage(file);

      const { categoryId } = createProductDto;
      const categoryRef = await this.categoriesService.getCategory(categoryId);

      const productData = {
        imageUrl,
        categoryId: categoryRef,
        ...createProductDto,
      };

      await addDoc(this.firebaseService.productsCollection, productData);
    } catch (error) {
      throw new NotFoundException('Product does not create');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    const storageRef = ref(
      this.firebaseService.storage,
      `images/products/${fileName}`,
    );

    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
      customMetadata: {
        originalName: file.originalname,
      },
    });

    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const productsSnapshot = await getDocs(
        this.firebaseService.productsCollection,
      );
      const products: Product[] = [];

      productsSnapshot.forEach((doc) => {
        const productData = doc.data() as Product;
        products.push({ id: doc.id, ...productData });
      });

      return products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async getOneProduct(id: string): Promise<Product> {
    try {
      const productDoc = await getDoc(
        doc(this.firebaseService.productsCollection, id),
      );
      if (!productDoc.exists()) {
        return null;
      }
      return productDoc.data() as Product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateProduct(
    id: string,
    file: Express.Multer.File,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const { categoryId } = updateProductDto;
      const categoryRef = await this.categoriesService.getCategory(categoryId);

      const productDoc = doc(this.firebaseService.productsCollection, id);
      const productSnapshot = await getDoc(productDoc);
      const productData = productSnapshot.data();

      if (file) {
        const isValidImage = imageValidation(file.mimetype);
        if (!isValidImage) {
          throw new Error('Invalid image format');
        }
        const imageUrl = await this.uploadImage(file);

        productData.imageUrl = imageUrl;
      }

      productData.categoryId = categoryRef;
      Object.assign(productData, updateProductDto);

      if (!file) {
        delete productData.image;
      }
      await setDoc(productDoc, productData);
      return productData as Product;
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

  async addExtraIngredients(body): Promise<void> {
    try {
      const { productId, ingredientId } = body;
    } catch (error) {
      throw new NotFoundException('Ingredient does not remove');
    }
  }
}
