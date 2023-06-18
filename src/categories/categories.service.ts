import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private firebaseService: FirebaseService) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<DocumentData> {
    try {
      const currentTime = new Date();
      const categoryData = {
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createCategoryDto,
      };
      const categoryRef = await this.firebaseService.categoriesCollection.add(
        categoryData,
      );
      return categoryRef;
    } catch (error) {
      throw new NotFoundException('Category was not created');
    }
  }

  async getCategories(): Promise<DocumentData[]> {
    try {
      const querySnapshot =
        await this.firebaseService.categoriesCollection.get();
      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      return categories;
    } catch (error) {
      throw new NotFoundException('Categories not found');
    }
  }

  async getCategory(id: string): Promise<Category | null> {
    try {
      const categoryDoc = await this.firebaseService.categoriesCollection
        .doc(id)
        .get();
      if (categoryDoc.exists) {
        const categoryData = categoryDoc.data();
        const category: Category = {
          id: categoryDoc.id,
          name: categoryData.name,
          slug: categoryData.slug,
          docRef: categoryDoc.ref.path,
        };
        return category;
      } else {
        return null;
      }
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<DocumentData> {
    try {
      const categoryRef: DocumentReference<DocumentData> =
        this.firebaseService.categoriesCollection.doc(id);

      const updatedData = {
        ...updateCategoryDto,
        updatedAt: new Date(),
      };

      await categoryRef.set(updatedData);
      return updatedData;
    } catch (error) {
      throw new NotFoundException('Ingredient was not updated');
    }
  }

  async removeCategory(id: string) {
    try {
      await this.firebaseService.categoriesCollection.doc(id).delete();
    } catch (error) {
      throw new NotFoundException('Category was not removed');
    }
  }
}
