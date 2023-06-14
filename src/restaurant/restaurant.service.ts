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
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<void> {
    try {
      await addDoc(
        this.firebaseService.restaurantsCollection,
        createRestaurantDto,
      );
    } catch (error) {
      throw new NotFoundException('Restaurant does not create');
    }
  }

  async getRestaurants(): Promise<any> {
    try {
      const data = await getDocs(this.firebaseService.restaurantsCollection);
      const restaurants = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return restaurants;
    } catch (error) {
      throw new NotFoundException('Restaurants not found');
    }
  }

  async getRestaurant(id: string): Promise<any> {
    try {
      const restaurantDoc = await getDoc(
        doc(this.firebaseService.restaurantsCollection, id),
      );
      if (!restaurantDoc.exists()) {
        return null;
      }
      return restaurantDoc.data();
    } catch (error) {
      throw new NotFoundException('Restaurant not found');
    }
  }

  async updateRestaurant(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<void> {
    try {
      const docRef = await setDoc(
        doc(this.firebaseService.restaurantsCollection, id),
        updateRestaurantDto,
      );
      return docRef;
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
