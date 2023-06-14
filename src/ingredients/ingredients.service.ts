import { Injectable, NotFoundException } from '@nestjs/common';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FirebaseService } from 'src/firebase/firebase.service';
import { imageValidation } from 'src/utils/file-uploading.utils';
import { v4 as uuidv4 } from 'uuid';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private firebaseService: FirebaseService) {}

  async createIngredient(
    file: Express.Multer.File,
    createIngredientDto: CreateIngredientDto,
  ) {
    try {
      const isValidImage = imageValidation(file.mimetype);

      if (!isValidImage) {
        throw new NotFoundException('Invalid image format');
      }
      const imageUrl = await this.uploadImage(file);

      const ingredientData = {
        selected: false,
        imageUrl,
        ...createIngredientDto,
      };

      await addDoc(this.firebaseService.ingredientsCollection, ingredientData);
    } catch (error) {
      throw new NotFoundException('Ingredient does not create');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    const storageRef = ref(
      this.firebaseService.storage,
      `images/ingredients/${fileName}`,
    );

    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
      customMetadata: {
        originalName: file.originalname,
      },
    });

    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  }

  async getIngredients() {
    try {
      const data = await getDocs(this.firebaseService.ingredientsCollection);
      const ingredients = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return ingredients;
    } catch (error) {
      throw new NotFoundException('Ingredients not found');
    }
  }

  async getIngredient(id: string) {
    try {
      const ingredientDoc = await getDoc(
        doc(this.firebaseService.ingredientsCollection, id),
      );
      if (!ingredientDoc.exists()) {
        return null;
      }
      return ingredientDoc.data();
    } catch (error) {
      throw new NotFoundException('Ingredient not found');
    }
  }

  async updateIngredient(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      const ingredient = await setDoc(
        doc(this.firebaseService.ingredientsCollection, id),
        updateIngredientDto,
      );
      return ingredient;
    } catch (error) {
      throw new NotFoundException('Ingredient does not update');
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firebaseService.ingredientsCollection, id));
    } catch (error) {
      throw new NotFoundException('Ingredient not deleted');
    }
  }

  // async createIngredientGroup(
  //   group: IngredientGroup,
  // ): Promise<IngredientGroup> {
  //   const docRef = await this.firestoreService.firestore
  //     .collection('ingredientGroups')
  //     .add(group);
  //   return { id: docRef.id, ...group };
  // }

  // async addIngredientToGroup(
  //   groupId: string,
  //   ingredientId: string,
  // ): Promise<IngredientGroup> {
  //   const groupRef = this.firestoreService.firestore
  //     .collection('ingredientGroups')
  //     .doc(groupId);
  //   const group = await groupRef.get();
  //   if (group.exists) {
  //     const updatedIngredients = [
  //       ...(group.data().ingredients || []),
  //       ingredientId,
  //     ];
  //     await groupRef.update({ ingredients: updatedIngredients });
  //     return { id: groupId, ...group.data() } as IngredientGroup;
  //   }
  //   return null;
  // }
}
