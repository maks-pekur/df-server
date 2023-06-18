import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { imageValidation } from 'src/utils/file-uploading.utils';
import { v4 as uuidv4 } from 'uuid';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(private firebaseService: FirebaseService) {}

  async create(file: Express.Multer.File, createStoryDto: CreateStoryDto) {
    try {
      const isValidImage = imageValidation(file.mimetype);

      if (!isValidImage) {
        throw new NotFoundException('Invalid image format');
      }

      const imageUrl = await this.uploadImage(file);
      const currentTime = new Date();

      const storyData = {
        imageUrl,
        isOpen: false,
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createStoryDto,
      };

      await this.firebaseService.storiesCollection.add(storyData);
    } catch (error) {
      throw new BadRequestException('Story does not create');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    const storageRef = this.firebaseService.storage
      .bucket()
      .file(`images/stories/${fileName}`);

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

  async findAll() {
    try {
      const querySnapshot = await this.firebaseService.storiesCollection.get();
      const stories = querySnapshot.docs.map((doc) => ({
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
      const storyRef = this.firebaseService.storiesCollection.doc(id);
      const storySnapshot = await storyRef.get();
      if (storySnapshot.exists) {
        const storyData = storySnapshot.data() as DocumentData;
        const story = { ...storyData, id: storySnapshot.id };
        return story;
      } else {
        throw new NotFoundException('Story not found');
      }
    } catch (error) {
      throw new NotFoundException('Story not found');
    }
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateStoryDto: UpdateStoryDto,
  ): Promise<DocumentData> {
    try {
      const storyRef: DocumentReference<DocumentData> =
        this.firebaseService.ingredientsCollection.doc(id);
      const storySnapshot: DocumentSnapshot = await storyRef.get();

      if (!storySnapshot.exists) {
        throw new NotFoundException('Ingredient not found');
      }

      const storyData: Partial<Story> = storySnapshot.data() as Partial<Story>;

      if (file) {
        const isValidImage = imageValidation(file.mimetype);
        if (!isValidImage) {
          throw new Error('Invalid image format');
        }
        const imageUrl = await this.uploadImage(file);
        storyData.imageUrl = imageUrl;
      }
      Object.assign(storyData, updateStoryDto);

      const updatedData = {
        ...storyData,
        updatedAt: new Date(),
      };

      await storyRef.update(updatedData);

      return updatedData;
    } catch (error) {
      throw new BadRequestException('Ingredient was not updated');
    }
  }

  async remove(id: string) {
    try {
      const storyRef = this.firebaseService.storiesCollection.doc(id);
      await storyRef.delete();
      return;
    } catch (error) {
      throw new NotFoundException('Category does not remove');
    }
  }
}
