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
      const products: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const product = doc.data();
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
      return productDoc.data();
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
        ...productData,
        updatedAt: new Date(),
      };

      await productRef.update(updatedData);
      const updatedProductSnapshot: DocumentSnapshot = await productRef.get();

      const updatedProduct: Product = {
        id: updatedProductSnapshot.id,
        name: updatedProductSnapshot.get('name'),
        imageUrl: updatedProductSnapshot.get('imageUrl'),
        price: updatedProductSnapshot.get('price'),
        categoryId: updatedProductSnapshot.get('categoryId'),
        createdAt: updatedProductSnapshot.createTime,
        updatedAt: updatedProductSnapshot.updateTime,
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
      const productSnapshot: DocumentSnapshot = await productRef.get();

      if (!productSnapshot.exists) {
        throw new NotFoundException('Product not found');
      }

      const productData: Product = productSnapshot.data() as Product;

      const imageUrl = productData.imageUrl;
      const imagePath = this.firebaseService.getPathFromUrl(imageUrl);
      try {
        await this.firebaseService.deleteFileFromStorage(imagePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete file ${imagePath} from Firebase Storage. Error: ${error.message}`,
        );
      }

      await productRef.delete();
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Product does not remove');
    }
  }
}
