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
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Product } from 'src/products/product.model';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger: Logger;
  constructor(private readonly firebaseService: FirebaseService) {
    this.logger = new Logger(ProductsService.name);
  }

  async getAllProducts(restaurantId?: string): Promise<Product[]> {
    const productSnapshot = await this.firebaseService.productsCollection.get();
    let products: Product[] = productSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product),
    );

    if (restaurantId) {
      const restaurantDocRef =
        this.firebaseService.restaurantsCollection.doc(restaurantId);
      const restaurantDoc = await restaurantDocRef.get();
      if (!restaurantDoc.exists) {
        throw new NotFoundException('Restaurant not found');
      }
      const restaurant: Restaurant = restaurantDoc.data() as Restaurant;

      // Add isInStopList flag to each product
      products = products.map((product) => ({
        ...product,
        isInStopList: restaurant.stopLists.productUUIDs.includes(product.id),
      }));
    }

    return products;
  }

  async getOneProduct(id: string, restaurantId?: string): Promise<Product> {
    const productRef = this.firebaseService.productsCollection.doc(id);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      throw new NotFoundException('Product not found');
    }

    const product: Product = {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    } as Product;

    if (restaurantId) {
      // Fetch the restaurant
      const restaurantDocRef =
        this.firebaseService.restaurantsCollection.doc(restaurantId);
      const restaurantSnapshot = await restaurantDocRef.get();
      if (!restaurantSnapshot.exists) {
        throw new NotFoundException('Restaurant not found');
      }

      const restaurant = restaurantSnapshot.data() as Restaurant;

      // Check if the product is in the restaurant's stop list
      if (restaurant.stopLists.productUUIDs.includes(id)) {
        // Add the isInStopList flag to the product
        product.isInStopList = true;
      } else {
        product.isInStopList = false;
      }
    }

    return product;
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
        type: 'product',
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
    await this.firebaseService.db.runTransaction(async (transaction) => {
      const productRef = this.firebaseService.productsCollection.doc(id);
      const productSnapshot = await transaction.get(productRef);

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

      // Fetch all restaurants
      const restaurantSnapshot = await transaction.get(
        this.firebaseService.restaurantsCollection,
      );
      const restaurants: Restaurant[] = restaurantSnapshot.docs.map((doc) => {
        const restaurantData = doc.data() as Restaurant;
        return {
          id: doc.id, // Get the document ID
          ...restaurantData,
        };
      });

      // Fetch popular products
      const popularProductsSnapshot = await transaction.get(
        this.firebaseService.popularProductCollection.doc('items'),
      );
      const popularProductsData = popularProductsSnapshot.data();

      // Check and remove product from popular list
      if (popularProductsData && popularProductsData.products.includes(id)) {
        popularProductsData.products = popularProductsData.products.filter(
          (productId) => productId !== id,
        );
        transaction.update(
          this.firebaseService.popularProductCollection.doc('items'),
          { products: popularProductsData.products },
        );
      }

      // Loop through each restaurant
      for (const restaurant of restaurants) {
        // Check if the product is in the restaurant's stop list
        if (restaurant.stopLists.productUUIDs.includes(id)) {
          // Remove the product from the stop list
          restaurant.stopLists.productUUIDs =
            restaurant.stopLists.productUUIDs.filter(
              (productId) => productId !== id,
            );
          if (!restaurant.id) {
            throw new Error('Restaurant ID is not defined or empty');
          }
          transaction.update(
            this.firebaseService.restaurantsCollection.doc(restaurant.id),
            { 'stopLists.productUUIDs': restaurant.stopLists.productUUIDs },
          );
        }
      }
      // Delete the product
      transaction.delete(productRef);
    });
  }
}
