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
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  constructor(private firebaseService: FirebaseService) {}

  async create(createStoryDto: CreateStoryDto) {
    try {
      const story = await addDoc(
        this.firebaseService.storiesCollection,
        createStoryDto,
      );
      return story;
    } catch (error) {
      throw new NotFoundException('Story does not create');
    }
  }

  async findAll() {
    try {
      const data = await getDocs(this.firebaseService.storiesCollection);
      const stories = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return stories;
    } catch (error) {
      throw new NotFoundException('Stories not found');
    }
  }

  async findOne(id: string) {
    try {
      const story = await getDoc(
        doc(this.firebaseService.storiesCollection, id),
      );
      return { ...story.data(), id: story.id };
    } catch (error) {
      throw new NotFoundException('Story not found');
    }
  }

  async update(id: string, updateStoryDto: UpdateStoryDto) {
    try {
      const story = await setDoc(
        doc(this.firebaseService.storiesCollection, id),
        updateStoryDto,
      );
      return story;
    } catch (error) {
      throw new NotFoundException('Category does not update');
    }
  }

  async remove(id: string) {
    try {
      const story = await deleteDoc(
        doc(this.firebaseService.storiesCollection, id),
      );
      return story;
    } catch (error) {
      throw new NotFoundException('Category does not remove');
    }
  }
}
