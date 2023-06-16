import { Injectable, NotFoundException } from '@nestjs/common';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const currentTime = serverTimestamp();
      const newRestaurant = {
        ...createRestaurantDto,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
      const docRef = await addDoc(
        this.firebaseService.restaurantsCollection,
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

  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const snapshot = await getDocs(
        this.firebaseService.restaurantsCollection,
      );
      const restaurants: Restaurant[] = [];
      snapshot.forEach((doc) => {
        const restaurantData = doc.data();
        const restaurant: Restaurant = {
          id: doc.id,
          name: restaurantData.name,
          createdAt: restaurantData.createdAt,
          updatedAt: restaurantData.updatedAt,
        };
        restaurants.push(restaurant);
      });
      return restaurants;
    } catch (error) {
      throw new NotFoundException('Failed to fetch restaurants');
    }
  }

  async getRestaurant(id: string): Promise<Restaurant> {
    try {
      const restaurantDoc = await getDoc(
        doc(this.firebaseService.restaurantsCollection, id),
      );
      if (!restaurantDoc.exists()) {
        return null;
      }
      const restaurantData = restaurantDoc.data();
      const restaurant: Restaurant = {
        id: restaurantDoc.id,
        name: restaurantData.name,
        createdAt: restaurantData.createdAt,
        updatedAt: restaurantData.updatedAt,
      };
      return restaurant;
    } catch (error) {
      throw new NotFoundException('Restaurant not found');
    }
  }

  async updateRestaurant(id: string, body): Promise<Restaurant> {
    try {
      const restaurantRef = doc(this.firebaseService.restaurantsCollection, id);
      const restaurantSnapshot = await getDoc(restaurantRef);

      if (!restaurantSnapshot.exists()) {
        throw new NotFoundException('Restaurant not found');
      }

      const restaurantData = restaurantSnapshot.data();
      const updatedData = {
        ...body,
        updatedAt: serverTimestamp(), // Update the updatedAt field
      };

      await updateDoc(restaurantRef, updatedData);

      const updatedRestaurantSnapshot = await getDoc(restaurantRef);
      const updatedRestaurantData = updatedRestaurantSnapshot.data();

      const updatedRestaurant: Restaurant = {
        id: updatedRestaurantSnapshot.id,
        name: restaurantData.name,
        createdAt: restaurantData.createdAt,
        updatedAt: updatedRestaurantData.updatedAt,
        ...updatedRestaurantData,
      };

      return updatedRestaurant;
    } catch (error) {
      throw new NotFoundException('Restaurant does not update');
    }
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      const product = await deleteDoc(
        doc(this.firebaseService.restaurantsCollection, id),
      );
      return product;
    } catch (error) {
      throw new NotFoundException('Restaurant does not remove');
    }
  }
}
