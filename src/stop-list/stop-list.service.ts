import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { StopList } from './entities/stop-list.entity';

@Injectable()
export class StopListService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
    this.logger = new Logger(StopListService.name);
  }

  async addToStopList(restaurantId: string, id: string): Promise<void> {
    const restaurantDocRef =
      this.firebaseService.restaurantsCollection.doc(restaurantId);

    // Fetch the product or ingredient
    const productSnapshot = await this.firebaseService.productsCollection
      .doc(id)
      .get();

    // Check if the item is a product or an ingredient
    const itemIsProduct = productSnapshot.exists;
    const itemType = itemIsProduct ? 'product' : 'ingredient';

    await this.firebaseService.db.runTransaction(async (transaction) => {
      const restaurantSnapshot = await transaction.get(restaurantDocRef);
      if (!restaurantSnapshot.exists) {
        throw new NotFoundException('Restaurant not found');
      }

      const restaurant = restaurantSnapshot.data() as Restaurant;
      if (itemType === 'product') {
        restaurant.stopLists.productUUIDs.push(id);
      } else {
        restaurant.stopLists.toppingUUIDs.push(id);
      }

      const updateData = {
        'stopLists.productUUIDs': restaurant.stopLists.productUUIDs,
        'stopLists.toppingUUIDs': restaurant.stopLists.toppingUUIDs,
      };

      transaction.update(restaurantDocRef, updateData);
    });
  }

  async removeFromStopList(restaurantId: string, id: string): Promise<string> {
    const restaurantDocRef =
      this.firebaseService.restaurantsCollection.doc(restaurantId);
    let type: 'product' | 'ingredient' | null = null;

    const productRef = this.firebaseService.productsCollection.doc(id);
    const productSnapshot = await productRef.get();

    const ingredientRef = this.firebaseService.ingredientsCollection.doc(id);
    const ingredientSnapshot = await ingredientRef.get();

    if (productSnapshot.exists) {
      type = 'product';
    } else if (ingredientSnapshot.exists) {
      type = 'ingredient';
    } else {
      throw new NotFoundException('Item not found');
    }

    await this.firebaseService.db.runTransaction(async (transaction) => {
      const restaurantSnapshot = await transaction.get(restaurantDocRef);
      if (!restaurantSnapshot.exists) {
        throw new NotFoundException('Restaurant not found');
      }
      const restaurant = restaurantSnapshot.data() as Restaurant;

      if (type === 'product') {
        restaurant.stopLists.productUUIDs =
          restaurant.stopLists.productUUIDs.filter((uuid) => uuid !== id);
      } else {
        restaurant.stopLists.toppingUUIDs =
          restaurant.stopLists.toppingUUIDs.filter((uuid) => uuid !== id);
      }

      const updateData = {
        'stopLists.productUUIDs': restaurant.stopLists.productUUIDs,
        'stopLists.toppingUUIDs': restaurant.stopLists.toppingUUIDs,
      };
      transaction.update(restaurantDocRef, updateData);
    });
    return 'Item successfully removed';
  }

  async getStopList(restaurantId: string): Promise<StopList> {
    const restaurantDocRef =
      this.firebaseService.restaurantsCollection.doc(restaurantId);
    const restaurantDoc = await restaurantDocRef.get();
    if (!restaurantDoc.exists) {
      throw new NotFoundException('Restaurant not found');
    }
    const restaurant = restaurantDoc.data() as Restaurant;
    return restaurant.stopLists;
  }
}
