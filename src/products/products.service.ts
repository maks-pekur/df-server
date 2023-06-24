import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger: Logger;
  constructor(
    private firebaseService: FirebaseService,
    private categoriesService: CategoriesService,
  ) {
    this.logger = new Logger(ProductsService.name);
  }

  async getAllProducts(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.productsCollection.get();

      const stopListDoc = await this.firebaseService.stopListCollection
        .doc('list')
        .get();

      const stopList = stopListDoc.data();
      const products: DocumentData[] = [];

      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const product = doc.data();
        product.isInStopList =
          stopList && stopList.productUUIDs.includes(doc.id);
        products.push({ id: doc.id, ...product });
      });
      return products;
    } catch (error) {
      this.logger.error(error);
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
      const productData = productDoc.data();

      const stopListDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.stopListCollection.doc('list').get();
      if (!stopListDoc.exists) {
        throw new NotFoundException('StopList not found');
      }
      const stopList = stopListDoc.data();

      productData.isInStopList = stopList && stopList.productUUIDs.includes(id);
      return productData;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Product not found');
    }
  }

  async createProduct(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      if (!file) {
        throw new BadRequestException('Image file required');
      }
      const imageUrl = await this.firebaseService.uploadImage(
        file,
        'static/img/products',
      );

      const { categoryId } = createProductDto;
      const categoryRef = this.firebaseService.categoriesCollection.doc(
        categoryId.toString(),
      );
      const categorySnapshot = await categoryRef.get();

      if (!categorySnapshot.exists) {
        throw new NotFoundException('Category not found');
      }

      const currentTime = new Date();
      const productData = {
        imageUrl,
        categoryId: categoryRef,
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createProductDto,
      };

      const productRef: DocumentReference =
        this.firebaseService.productsCollection.doc();
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
      this.logger.error(error);
      throw new BadRequestException('Product does not create');
    }
  }

  async updateProduct(
    id: string,
    file: Express.Multer.File,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const { categoryId } = updateProductDto;

      const categoryRef = this.firebaseService.categoriesCollection.doc(
        categoryId.toString(),
      );
      const categorySnapshot = await categoryRef.get();
      if (!categorySnapshot.exists) {
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
        if (productData.imageUrl) {
          const oldImagePath = this.firebaseService.getPathFromUrl(
            productData.imageUrl,
          );
          try {
            await this.firebaseService.deleteFileFromStorage(oldImagePath);
          } catch (error) {
            this.logger.warn(
              `Failed to delete file ${oldImagePath} from Firebase Storage. Error: ${error.message}`,
            );
          }
        }

        const imageUrl = await this.firebaseService.uploadImage(
          file,
          'static/img/products',
        );
        productData.imageUrl = imageUrl;
      }

      productData.categoryId = this.firebaseService.db.doc(
        `categories/${categoryId}`,
      );

      Object.assign(productData, updateProductDto);

      const updatedData = {
        categoryId: this.firebaseService.db.doc(`categories/${categoryId}`),
        imageUrl: productData.imageUrl,
        updatedAt: new Date(),
        ...updateProductDto,
      };

      await productRef.update(updatedData);
      const updatedProductSnapshot: DocumentSnapshot = await productRef.get();

      const updatedProduct: Product = {
        id: updatedProductSnapshot.id,
        imageUrl: updatedProductSnapshot.get('imageUrl'),
        createdAt: updatedProductSnapshot.createTime.toDate(),
        updatedAt: updatedProductSnapshot.updateTime.toDate(),
        ...updateProductDto,
      };

      return updatedProduct;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Product does not update');
    }
  }

  async removeProduct(id: string): Promise<void> {
    try {
      const productRef: DocumentReference =
        this.firebaseService.productsCollection.doc(id);

      const stopListRef = this.firebaseService.stopListCollection.doc('list');

      // Start transaction
      await this.firebaseService.db.runTransaction(async (transaction) => {
        // Get product from Firestore
        const productSnapshot: DocumentSnapshot = await transaction.get(
          productRef,
        );

        if (!productSnapshot.exists) {
          throw new NotFoundException('Product not found');
        }

        // Get stopList from Firestore
        const stopListSnapshot = await transaction.get(stopListRef);
        let stopListData = null;
        if (stopListSnapshot.exists) {
          stopListData = stopListSnapshot.data();
          if (stopListData.productUUIDs.includes(id)) {
            stopListData.productUUIDs = stopListData.productUUIDs.filter(
              (uuid) => uuid !== id,
            );
          }
        }

        const productData: Product = productSnapshot.data() as Product;
        const imageUrl = productData.imageUrl;
        const imagePath = this.firebaseService.getPathFromUrl(imageUrl);

        // Delete image from Firebase Storage
        try {
          await this.firebaseService.deleteFileFromStorage(imagePath);
        } catch (error) {
          this.logger.warn(
            `Failed to delete file ${imagePath} from Firebase Storage. Error: ${error.message}`,
          );
        }

        // Delete product from Firestore
        transaction.delete(productRef);

        // Update stopList in Firestore
        if (stopListData !== null) {
          transaction.update(stopListRef, stopListData);
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Product does not remove');
    }
  }
}
