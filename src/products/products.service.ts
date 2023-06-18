import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase-admin/firestore';
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
  ): Promise<Product> {
    try {
      const isValidImage = imageValidation(file.mimetype);
      if (!isValidImage) {
        throw new NotFoundException('Invalid image format');
      }
      const imageUrl = await this.uploadImage(file);

      const { categoryId } = createProductDto;
      const categoryRef = await this.categoriesService.getCategory(categoryId);

      if (!categoryRef) {
        throw new NotFoundException('Category not found');
      }

      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        imageUrl,
        categoryId: categoryRef,
        ...createProductDto,
      };

      const productRef: DocumentReference =
        await this.firebaseService.productsCollection.doc();
      await productRef.set(productData);

      const productSnapshot: DocumentSnapshot<DocumentData> =
        await productRef.get();

      const product: Product = {
        id: productSnapshot.id,
        createdAt: productSnapshot.createTime.toDate(),
        updatedAt: productSnapshot.updateTime.toDate(),
        ...productData,
      };

      return product;
    } catch (error) {
      throw new NotFoundException('Product does not create');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const bucket = this.firebaseService.storage.bucket();

    const fileRef = bucket.file(`images/products/${fileName}`);
    const contentType = file.mimetype;

    await fileRef.save(file.buffer, {
      metadata: {
        contentType,
        metadata: {
          originalName: file.originalname,
        },
      },
    });

    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return signedUrl;
  }

  async getAllProducts(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.productsCollection.get();
      const products: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const product = doc.data();
        products.push({ id: doc.id, ...product });
      });
      return products;
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async getOneProduct(id: string): Promise<DocumentData | null> {
    try {
      const productDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.productsCollection.doc(id).get();
      if (!productDoc.exists) {
        return null;
      }
      return productDoc.data();
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
      if (!categoryRef) {
        throw new NotFoundException('Category not found');
      }

      const productRef: DocumentReference =
        this.firebaseService.productsCollection.doc(id);
      const productSnapshot: DocumentSnapshot = await productRef.get();

      if (!productSnapshot.exists) {
        throw new NotFoundException('Product not found');
      }

      const productData: Partial<Product> =
        productSnapshot.data() as Partial<Product>;

      if (file) {
        const isValidImage = imageValidation(file.mimetype);
        if (!isValidImage) {
          throw new Error('Invalid image format');
        }
        const imageUrl = await this.uploadImage(file);
        productData.imageUrl = imageUrl;
      }

      productData.categoryId = categoryRef.id;
      Object.assign(productData, updateProductDto);

      await productRef.update(productData);
      const updatedProductSnapshot: DocumentSnapshot = await productRef.get();

      const updatedProduct: Product = {
        id: updatedProductSnapshot.id,
        name: updatedProductSnapshot.get('name'),
        imageUrl: updatedProductSnapshot.get('imageUrl'),
        price: updatedProductSnapshot.get('price'),
        categoryId: updatedProductSnapshot.get('categoryId'),
        createdAt: updatedProductSnapshot.get('createdAt'),
        updatedAt: updatedProductSnapshot.get('updatedAt'),
        ...updateProductDto,
      };

      return updatedProduct;
    } catch (error) {
      throw new NotFoundException('Product does not update');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const productRef: DocumentReference =
        this.firebaseService.productsCollection.doc(id);
      await productRef.delete();
    } catch (error) {
      throw new NotFoundException('Product does not remove');
    }
  }
}
