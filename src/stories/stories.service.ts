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
} from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
    this.logger = new Logger(StoriesService.name);
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

  async createStory(file: Express.Multer.File, createStoryDto: CreateStoryDto) {
    try {
      if (!file) {
        throw new BadRequestException('Image file required');
      }
      const imageUrl = await this.firebaseService.uploadImage(
        file,
        'static/img/stories',
      );
      const currentTime = new Date();

      const storyData = {
        imageUrl,
        isOpen: false,
        createdAt: currentTime,
        updatedAt: currentTime,
        ...createStoryDto,
      };

      const storyRef: DocumentReference =
        this.firebaseService.storiesCollection.doc();
      await storyRef.set(storyData);

      const storySnapshot: DocumentSnapshot<DocumentData> =
        await storyRef.get();

      const story: Story = {
        id: storySnapshot.id,
        createdAt: storySnapshot.createTime.toDate(),
        updatedAt: storySnapshot.updateTime.toDate(),
        ...storyData,
      };

      return story;
    } catch (error) {
      throw new BadRequestException('Story does not create');
    }
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateStoryDto: UpdateStoryDto,
  ): Promise<DocumentData> {
    try {
      const storyRef: DocumentReference<DocumentData> =
        this.firebaseService.storiesCollection.doc(id);
      const storySnapshot: DocumentSnapshot = await storyRef.get();

      if (!storySnapshot.exists) {
        throw new NotFoundException('Story not found');
      }

      const storyData: Partial<Story> = storySnapshot.data() as Partial<Story>;

      if (file) {
        if (storyData.imageUrl) {
          const oldImagePath = this.firebaseService.getPathFromUrl(
            storyData.imageUrl,
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
          'static/img/stories',
        );
        storyData.imageUrl = imageUrl;
      }

      Object.assign(storyData, updateStoryDto);

      const updatedData = {
        ...storyData,
        updatedAt: new Date(),
      };

      await storyRef.update(updatedData);
      const updatedStorySnapshot: DocumentSnapshot = await storyRef.get();

      const updatedStory: Story = {
        id: updatedStorySnapshot.id,
        title: updatedStorySnapshot.get('title'),
        imageUrl: updatedStorySnapshot.get('imageUrl'),
        createdAt: updatedStorySnapshot.createTime,
        updatedAt: updatedStorySnapshot.updateTime,
        ...updateStoryDto,
      };

      return updatedStory;
    } catch (error) {
      throw new BadRequestException('Story was not updated');
    }
  }

  async remove(id: string) {
    try {
      const storyRef: DocumentReference =
        this.firebaseService.storiesCollection.doc(id);
      const storySnapshot: DocumentSnapshot = await storyRef.get();

      if (!storySnapshot.exists) {
        throw new NotFoundException('Story not found');
      }

      const storyData: Story = storySnapshot.data() as Story;

      const imageUrl = storyData.imageUrl;
      const imagePath = this.firebaseService.getPathFromUrl(imageUrl);
      try {
        await this.firebaseService.deleteFileFromStorage(imagePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete file ${imagePath} from Firebase Storage. Error: ${error.message}`,
        );
      }

      await storyRef.delete();
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException('Story does not remove');
    }
  }
}
