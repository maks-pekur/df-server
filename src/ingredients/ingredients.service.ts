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
  QuerySnapshot,
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientGroupsService } from './ingredient-groups.service';

@Injectable()
export class IngredientsService {
  private readonly logger: Logger;
  constructor(
    private firebaseService: FirebaseService,
    private ingredientGroupsService: IngredientGroupsService,
  ) {
    this.logger = new Logger(IngredientsService.name);
  }

  async createIngredient(
    file: Express.Multer.File,
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    try {
      if (!file) {
        throw new BadRequestException('Image file required');
      }
      const imageUrl = await this.firebaseService.uploadImage(
        file,
        'static/img/ingredients',
      );

      const currentTime = new Date();

      const ingredientData = {
        imageUrl,
        type: 'ingredient',
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createIngredientDto,
      };

      const ingredientRef: DocumentReference =
        this.firebaseService.ingredientsCollection.doc();
      await ingredientRef.set(ingredientData);

      const ingredientSnapshot: DocumentSnapshot<DocumentData> =
        await ingredientRef.get();

      const ingredient: Ingredient = {
        id: ingredientSnapshot.id,
        createdAt: ingredientSnapshot.createTime.toDate(),
        updatedAt: ingredientSnapshot.updateTime.toDate(),
        ...ingredientData,
      };

      return ingredient;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Ingredient was not created');
    }
  }

  async getIngredients(restaurantId?: string): Promise<Ingredient[]> {
    try {
      const ingredientSnapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.ingredientsCollection.get();
      let ingredients: Ingredient[] = ingredientSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Ingredient),
      );

      if (restaurantId) {
        const restaurantDocRef =
          this.firebaseService.restaurantsCollection.doc(restaurantId);
        const restaurantDoc = await restaurantDocRef.get();
        if (!restaurantDoc.exists) {
          throw new NotFoundException('Restaurant not found');
        }
        const restaurant: Restaurant = restaurantDoc.data() as Restaurant;

        // Add isInStopList flag to each ingredient
        ingredients = ingredients.map((ingredient) => ({
          ...ingredient,
          isInStopList: restaurant.stopLists.toppingUUIDs.includes(
            ingredient.id,
          ),
        }));
      }

      return ingredients;
    } catch (error) {
      throw error;
    }
  }

  async getIngredient(
    id: string,
    restaurantId?: string,
  ): Promise<DocumentData | null> {
    try {
      const ingredientRef =
        await this.firebaseService.ingredientsCollection.doc(id);
      const ingredientSnapshot = await ingredientRef.get();

      if (!ingredientSnapshot.exists) {
        throw new NotFoundException('Ingredient not found');
      }
      const ingredient: Ingredient = {
        id: ingredientSnapshot.id,
        ...ingredientSnapshot.data(),
      } as Ingredient;

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
        if (restaurant.stopLists.toppingUUIDs.includes(id)) {
          // Add the isInStopList flag to the product
          ingredient.isInStopList = true;
        } else {
          ingredient.isInStopList = false;
        }
      }
      return ingredient;
    } catch (error) {
      throw error;
    }
  }

  async updateIngredient(
    id: string,
    file: Express.Multer.File,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    try {
      const ingredientRef: DocumentReference<DocumentData> =
        this.firebaseService.ingredientsCollection.doc(id);
      const ingredientSnapshot: DocumentSnapshot = await ingredientRef.get();

      if (!ingredientSnapshot.exists) {
        throw new NotFoundException('Ingredient not found');
      }

      const ingredientData: Partial<Ingredient> =
        ingredientSnapshot.data() as Partial<Ingredient>;

      if (file) {
        if (ingredientData.imageUrl) {
          const oldImagePath = this.firebaseService.getPathFromUrl(
            ingredientData.imageUrl,
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
          'static/img/ingredients',
        );
        ingredientData.imageUrl = imageUrl;
      }

      Object.assign(ingredientData, updateIngredientDto);

      const updatedData = {
        ...ingredientData,
        ...updateIngredientDto,
        updatedAt: new Date(),
      };

      await ingredientRef.update(updatedData);

      const updatedIngredientSnapshot: DocumentSnapshot =
        await ingredientRef.get();

      const updatedIngredient: Ingredient = {
        name: updatedIngredientSnapshot.get('name'),
        imageUrl: updatedIngredientSnapshot.get('imageUrl'),
        price: updatedIngredientSnapshot.get('price'),
        createdAt: updatedIngredientSnapshot.createTime,
        updatedAt: updatedIngredientSnapshot.updateTime,
        ...updateIngredientDto,
      };

      return updatedIngredient;
    } catch (error) {
      throw new BadRequestException('Ingredient was not updated');
    }
  }

  async removeIngredient(id: string): Promise<void> {
    await this.firebaseService.db.runTransaction(async (transaction) => {
      const ingredientRef = this.firebaseService.ingredientsCollection.doc(id);
      const ingredientSnapshot = await transaction.get(ingredientRef);

      if (!ingredientSnapshot.exists) {
        throw new NotFoundException('Ingredient not found');
      }

      const ingredientData = ingredientSnapshot.data() as Ingredient;

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

      // Loop through each restaurant
      for (const restaurant of restaurants) {
        // Check if the ingredient is in the restaurant's stop list
        if (restaurant.stopLists.toppingUUIDs.includes(id)) {
          // Remove the ingredient from the stop list
          restaurant.stopLists.toppingUUIDs =
            restaurant.stopLists.toppingUUIDs.filter(
              (ingredientId) => ingredientId !== id,
            );
          if (!restaurant.id) {
            throw new Error('Restaurant ID is not defined or empty');
          }
          transaction.update(
            this.firebaseService.restaurantsCollection.doc(restaurant.id),
            { 'stopLists.toppingUUIDs': restaurant.stopLists.toppingUUIDs },
          );
        }
      }

      // Fetch all ingredient groups
      const ingredientGroups =
        await this.ingredientGroupsService.getAllIngredientGroups();

      // Loop through each group
      for (const group of ingredientGroups) {
        // Check if the ingredient is in the group
        if (group.ingredientsIds.includes(id)) {
          // Remove the ingredient from the group
          await this.ingredientGroupsService.removeIngredientFromGroup(
            group.id,
            id,
          );
        }
      }

      // Delete ingredient image from storage if it exists
      if (ingredientData.imageUrl) {
        await this.firebaseService.deleteFileFromStorage(
          ingredientData.imageUrl,
        );
      }
      // Delete the ingredient
      transaction.delete(ingredientRef);
    });
  }
}
