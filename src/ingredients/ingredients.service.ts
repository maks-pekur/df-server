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
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
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
        selected: false,
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

  async getIngredients(): Promise<DocumentData[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> =
        await this.firebaseService.ingredientsCollection.get();
      const ingredients: DocumentData[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        ingredients.push({ id: doc.id, ...doc.data() });
      });
      return ingredients;
    } catch (error) {
      throw new BadRequestException('Ingredients not found');
    }
  }

  async getIngredient(id: string): Promise<DocumentData | null> {
    try {
      const ingredientDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.ingredientsCollection.doc(id).get();
      if (!ingredientDoc.exists) {
        return null;
      }
      return ingredientDoc.data();
    } catch (error) {
      throw new NotFoundException('Ingredient not found');
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
        updatedAt: new Date(),
      };

      await ingredientRef.update(updatedData);

      const updatedIngredientSnapshot: DocumentSnapshot =
        await ingredientRef.get();

      const updatedIngredient: Ingredient = {
        id: updatedIngredientSnapshot.id,
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
    try {
      const ingredientRef: DocumentReference =
        this.firebaseService.ingredientsCollection.doc(id);
      const ingredientSnapshot: DocumentSnapshot = await ingredientRef.get();

      if (!ingredientSnapshot.exists) {
        throw new NotFoundException('Ingredient not found');
      }

      const ingredientData: Ingredient =
        ingredientSnapshot.data() as Ingredient;

      const imageUrl = ingredientData.imageUrl;
      const imagePath = this.firebaseService.getPathFromUrl(imageUrl);
      try {
        await this.firebaseService.deleteFileFromStorage(imagePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete file ${imagePath} from Firebase Storage. Error: ${error.message}`,
        );
      }

      await ingredientRef.delete();
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Ingredient does not remove');
    }
  }
}
