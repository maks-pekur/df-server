import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const currentTime = new Date();
      const newRestaurant = {
        ...createRestaurantDto,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
      const docRef = await this.firebaseService.restaurantsCollection.add(
        newRestaurant,
      );
      const createdRestaurant: Restaurant = {
        id: docRef.id,
        ...newRestaurant,
      };
      return createdRestaurant;
    } catch (error) {
      throw new NotFoundException('Restaurant does not create');
    }
  }

  async getRestaurants(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.restaurantsCollection.get();
      const restaurants: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        restaurants.push({ id: doc.id, ...doc.data() });
      });
      return restaurants;
    } catch (error) {
      throw new NotFoundException('Restaurants not found');
    }
  }

  async getRestaurant(id: string): Promise<DocumentData | null> {
    try {
      const restaurantDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.restaurantsCollection.doc(id).get();
      if (!restaurantDoc.exists) {
        return null;
      }
      return restaurantDoc.data();
    } catch (error) {
      throw new NotFoundException('Restaurant not found');
    }
  }

  async updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const restaurantRef: DocumentReference<DocumentData> =
        this.firebaseService.restaurantsCollection.doc(id);

      const updatedData = {
        ...updateRestaurantDto,
        updatedAt: new Date(),
      };
      await restaurantRef.set(updatedData);
    } catch (error) {
      throw new NotFoundException('Restaurant was not updated');
    }
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      const restaurantRef: DocumentReference<DocumentData> =
        this.firebaseService.ingredientsCollection.doc(id);
      await restaurantRef.delete();
    } catch (error) {
      throw new NotFoundException('Restaurant was not deleted');
    }
  }
}
