import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StopList } from 'src/stop-list/entities/stop-list.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  private readonly logger: Logger;
  constructor(private readonly firebaseService: FirebaseService) {
    this.logger = new Logger(RestaurantsService.name);
  }

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const docRef = await this.firebaseService.restaurantsCollection.add(
        createRestaurantDto,
      );
      const stopList: StopList = {
        restaurantId: docRef.id,
        productUUIDs: [],
        toppingUUIDs: [],
      };
      await this.firebaseService.stopListCollection
        .doc(docRef.id)
        .set(stopList);
      return { id: docRef.id, ...createRestaurantDto };
    } catch (error) {
      throw new BadRequestException('Failed to create restaurant');
    }
  }

  async getAllRestaurants(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.restaurantsCollection.get();
      const restaurants: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const restaurant = doc.data();
        restaurants.push({ id: doc.id, ...restaurant });
      });
      return restaurants;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Restaurants not found');
    }
  }

  async getOneRestaurant(id: string): Promise<DocumentData | null> {
    try {
      const restaurantDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.restaurantsCollection.doc(id).get();
      if (!restaurantDoc.exists) {
        return null;
      }
      return { id: restaurantDoc.id, ...restaurantDoc.data() };
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Restaurant not found');
    }
  }
}
