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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
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

  async findAll() {
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

  async findOne(id: string) {
    try {
      const category = await getDoc(
        doc(this.firebaseService.categoriesCollection, id),
      );
      return { ...category.data(), id: category.id };
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
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

  async remove(id: string) {
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
