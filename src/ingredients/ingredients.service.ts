import {
  BadRequestException,
  Injectable,
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
import { imageValidation } from 'src/utils/file-uploading.utils';
import { v4 as uuidv4 } from 'uuid';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(private firebaseService: FirebaseService) {}

  async createIngredient(
    file: Express.Multer.File,
    createIngredientDto: CreateIngredientDto,
  ): Promise<string> {
    try {
      const isValidImage = imageValidation(file.mimetype);

      if (!isValidImage) {
        throw new NotFoundException('Invalid image format');
      }

      const imageUrl = await this.uploadImage(file);

      const currentTime = new Date();

      const ingredientData = {
        imageUrl,
        selected: false,
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createIngredientDto,
      };

      await this.firebaseService.ingredientsCollection.add(ingredientData);

      return 'Ingredient created successfully';
    } catch (error) {
      throw new BadRequestException('Ingredient was not created');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    const storageRef = this.firebaseService.storage
      .bucket()
      .file(`images/ingredients/${fileName}`);

    await storageRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        metadata: {
          originalName: file.originalname,
        },
      },
    });

    const imageUrl = await storageRef.getSignedUrl({
      action: 'read',
      expires: '2030-01-01',
    });

    return imageUrl[0];
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
  ): Promise<DocumentData> {
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
        const isValidImage = imageValidation(file.mimetype);
        if (!isValidImage) {
          throw new Error('Invalid image format');
        }
        const imageUrl = await this.uploadImage(file);
        ingredientData.imageUrl = imageUrl;
      }
      Object.assign(ingredientData, updateIngredientDto);

      const updatedData = {
        ...ingredientData,
        updatedAt: new Date(),
      };

      await ingredientRef.update(updatedData);

      return updatedData;
    } catch (error) {
      throw new BadRequestException('Ingredient was not updated');
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    try {
      const ingredientRef: DocumentReference<DocumentData> =
        this.firebaseService.ingredientsCollection.doc(id);
      await ingredientRef.delete();
    } catch (error) {
      throw new BadRequestException('Ingredient was not deleted');
    }
  }
}
