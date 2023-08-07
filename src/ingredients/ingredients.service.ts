import { Injectable, Logger } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientGroupsService } from './ingredient-groups.service';

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger(IngredientsService.name);

  constructor(private ingredientGroupsService: IngredientGroupsService) {}

  async createIngredient(
    file: Express.Multer.File,
    createIngredientDto: CreateIngredientDto,
  ) {
    // try {
    //   if (!file) {
    //     throw new BadRequestException('Image file required');
    //   }
    //   const imageUrl = await this.firebaseService.uploadImage(
    //     file,
    //     'static/img/ingredients',
    //   );
    //   const currentTime = new Date();
    //   const ingredientData = {
    //     imageUrl,
    //     type: 'ingredient',
    //     createdAt: currentTime,
    //     updatedAt: currentTime,
    //     ...createIngredientDto,
    //   };
    //   const ingredientRef: DocumentReference =
    //     this.firebaseService.ingredientsCollection.doc();
    //   await ingredientRef.set(ingredientData);
    //   const ingredientSnapshot: DocumentSnapshot<DocumentData> =
    //     await ingredientRef.get();
    //   const ingredient: Ingredient = {
    //     id: ingredientSnapshot.id,
    //     createdAt: ingredientSnapshot.createTime.toDate(),
    //     updatedAt: ingredientSnapshot.updateTime.toDate(),
    //     ...ingredientData,
    //   };
    //   return ingredient;
    // } catch (error) {
    //   console.error(error);
    //   throw new BadRequestException('Ingredient was not created');
    // }
  }

  async getIngredients(storeId?: string) {
    // try {
    //   const ingredientSnapshot: QuerySnapshot<DocumentData> =
    //     await this.firebaseService.ingredientsCollection.get();
    //   let ingredients: Ingredient[] = ingredientSnapshot.docs.map(
    //     (doc) =>
    //       ({
    //         id: doc.id,
    //         ...doc.data(),
    //       } as Ingredient),
    //   );
    //   if (storeId) {
    //     const storeDocRef = this.firebaseService.storesCollection.doc(storeId);
    //     const storeDoc = await storeDocRef.get();
    //     if (!storeDoc.exists) {
    //       throw new NotFoundException('Store not found');
    //     }
    //     const store: Store = storeDoc.data() as Store;
    //     // Add isInStopList flag to each ingredient
    //     ingredients = ingredients.map((ingredient) => ({
    //       ...ingredient,
    //       isInStopList: store.stopLists.toppingUUIDs.includes(ingredient.id),
    //     }));
    //   }
    //   return ingredients;
    // } catch (error) {
    //   throw error;
    // }
  }

  async getIngredient(id: string, storeId?: string) {
    // try {
    //   const ingredientRef = this.firebaseService.ingredientsCollection.doc(id);
    //   const ingredientSnapshot = await ingredientRef.get();
    //   if (!ingredientSnapshot.exists) {
    //     throw new NotFoundException('Ingredient not found');
    //   }
    //   const ingredient: Ingredient = {
    //     id: ingredientSnapshot.id,
    //     ...ingredientSnapshot.data(),
    //   } as Ingredient;
    //   if (storeId) {
    //     // Fetch the store
    //     const storeDocRef = this.firebaseService.storesCollection.doc(storeId);
    //     const storeSnapshot = await storeDocRef.get();
    //     if (!storeSnapshot.exists) {
    //       throw new NotFoundException('Store not found');
    //     }
    //     const store = storeSnapshot.data() as Store;
    //     // Check if the product is in the restaurant's stop list
    //     if (store.stopLists.toppingUUIDs.includes(id)) {
    //       // Add the isInStopList flag to the product
    //       ingredient.isInStopList = true;
    //     } else {
    //       ingredient.isInStopList = false;
    //     }
    //   }
    //   return ingredient;
    // } catch (error) {
    //   throw error;
    // }
  }

  async updateIngredient(
    id: string,
    file: Express.Multer.File,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    // try {
    //   const ingredientRef: DocumentReference<DocumentData> =
    //     this.firebaseService.ingredientsCollection.doc(id);
    //   const ingredientSnapshot: DocumentSnapshot = await ingredientRef.get();
    //   if (!ingredientSnapshot.exists) {
    //     throw new NotFoundException('Ingredient not found');
    //   }
    //   const ingredientData: Partial<Ingredient> =
    //     ingredientSnapshot.data() as Partial<Ingredient>;
    //   if (file) {
    //     if (ingredientData.imageUrl) {
    //       const oldImagePath = this.firebaseService.getPathFromUrl(
    //         ingredientData.imageUrl,
    //       );
    //       try {
    //         await this.firebaseService.deleteFileFromStorage(oldImagePath);
    //       } catch (error) {
    //         this.logger.warn(
    //           `Failed to delete file ${oldImagePath} from Firebase Storage. Error: ${error.message}`,
    //         );
    //       }
    //     }
    //     const imageUrl = await this.firebaseService.uploadImage(
    //       file,
    //       'static/img/ingredients',
    //     );
    //     ingredientData.imageUrl = imageUrl;
    //   }
    //   Object.assign(ingredientData, updateIngredientDto);
    //   const updatedData = {
    //     ...ingredientData,
    //     ...updateIngredientDto,
    //     updatedAt: new Date(),
    //   };
    //   await ingredientRef.update(updatedData);
    //   const updatedIngredientSnapshot: DocumentSnapshot =
    //     await ingredientRef.get();
    //   const updatedIngredient: Ingredient = {
    //     name: updatedIngredientSnapshot.get('name'),
    //     imageUrl: updatedIngredientSnapshot.get('imageUrl'),
    //     price: updatedIngredientSnapshot.get('price'),
    //     createdAt: updatedIngredientSnapshot.createTime,
    //     updatedAt: updatedIngredientSnapshot.updateTime,
    //     ...updateIngredientDto,
    //   };
    //   return updatedIngredient;
    // } catch (error) {
    //   throw new BadRequestException('Ingredient was not updated');
    // }
  }

  async removeIngredient(id: string): Promise<void> {
    //   await this.firebaseService.db.runTransaction(async (transaction) => {
    //     const ingredientRef = this.firebaseService.ingredientsCollection.doc(id);
    //     const ingredientSnapshot = await transaction.get(ingredientRef);
    //     if (!ingredientSnapshot.exists) {
    //       throw new NotFoundException('Ingredient not found');
    //     }
    //     const ingredientData = ingredientSnapshot.data() as Ingredient;
    //     // Fetch all stores
    //     const storesSnapshot = await transaction.get(
    //       this.firebaseService.storesCollection,
    //     );
    //     const stores: Store[] = storesSnapshot.docs.map((doc) => {
    //       const storeData = doc.data() as Store;
    //       return {
    //         id: doc.id,
    //         ...storeData,
    //       };
    //     });
    //     // Loop through each restaurant
    //     for (const store of stores) {
    //       // Check if the ingredient is in the restaurant's stop list
    //       if (store.stopLists.toppingUUIDs.includes(id)) {
    //         // Remove the ingredient from the stop list
    //         store.stopLists.toppingUUIDs = store.stopLists.toppingUUIDs.filter(
    //           (ingredientId) => ingredientId !== id,
    //         );
    //         if (!store.id) {
    //           throw new Error('Restaurant ID is not defined or empty');
    //         }
    //         transaction.update(
    //           this.firebaseService.storesCollection.doc(store.id),
    //           { 'stopLists.toppingUUIDs': store.stopLists.toppingUUIDs },
    //         );
    //       }
    //     }
    //     // Fetch all ingredient groups
    //     const ingredientGroups =
    //       await this.ingredientGroupsService.getAllIngredientGroups();
    //     // Loop through each group
    //     for (const group of ingredientGroups) {
    //       // Check if the ingredient is in the group
    //       if (group.ingredientsIds.includes(id)) {
    //         // Remove the ingredient from the group
    //         await this.ingredientGroupsService.removeIngredientFromGroup(
    //           group.id,
    //           id,
    //         );
    //       }
    //     }
    //     // Delete ingredient image from storage if it exists
    //     if (ingredientData.imageUrl) {
    //       await this.firebaseService.deleteFileFromStorage(
    //         ingredientData.imageUrl,
    //       );
    //     }
    //     // Delete the ingredient
    //     transaction.delete(ingredientRef);
    //   });
    // }
  }
}
