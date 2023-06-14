import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private firebaseService: FirebaseService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await addDoc(
        this.firebaseService.categoriesCollection,
        createCategoryDto,
      );
      return category;
    } catch (error) {
      throw new NotFoundException('Category does not create');
    }
  }

  async getCategories() {
    try {
      const data = await getDocs(this.firebaseService.categoriesCollection);
      const categories = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return categories;
    } catch (error) {
      throw new NotFoundException('Categories not found');
    }
  }

  async getCategory(id: string): Promise<DocumentReference<DocumentData>> {
    const categoryRef = doc(this.firebaseService.categoriesCollection, id);
    const categorySnapshot = await getDoc(categoryRef);
    if (!categorySnapshot.exists()) {
      throw new NotFoundException('Category not found');
    }
    return categoryRef;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await setDoc(
        doc(this.firebaseService.categoriesCollection, id),
        updateCategoryDto,
      );
      return category;
    } catch (error) {
      throw new NotFoundException('Category does not update');
    }
  }

  async removeCategory(id: string) {
    try {
      const category = await deleteDoc(
        doc(this.firebaseService.categoriesCollection, id),
      );
      return category;
    } catch (error) {
      throw new NotFoundException('Category does not remove');
    }
  }
}
