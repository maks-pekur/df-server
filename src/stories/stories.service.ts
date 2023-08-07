import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
  ) {}

  async findAll() {
    const stories = await this.storyRepository.find();

    if (!stories.length) {
      throw new NotFoundException('Stories not found');
    }

    return stories;
  }

  async findOne(id: string) {
    const story = await this.storyRepository.findOne({ where: { id } });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return story;
  }

  async createStory(file: Express.Multer.File, createStoryDto: CreateStoryDto) {
    //   if (!file) {
    //     throw new BadRequestException('Image file required');
    //   }
    //   const imageUrl = await this.firebaseService.uploadImage(
    //     file,
    //     'static/img/stories',
    //   );
    const existStory = await this.storyRepository.findOne({
      where: { title: createStoryDto.title },
    });

    if (existStory) {
      throw new BadRequestException('Category already exists');
    }

    return this.storyRepository.save(createStoryDto);
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateStoryDto: UpdateStoryDto,
  ) {
    // try {
    //   const storyRef: DocumentReference<DocumentData> =
    //     this.firebaseService.storiesCollection.doc(id);
    //   const storySnapshot: DocumentSnapshot = await storyRef.get();
    //   if (!storySnapshot.exists) {
    //     throw new NotFoundException('Story not found');
    //   }
    //   const storyData: Partial<Story> = storySnapshot.data() as Partial<Story>;
    //   if (file) {
    //     if (storyData.imageUrl) {
    //       const oldImagePath = this.firebaseService.getPathFromUrl(
    //         storyData.imageUrl,
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
    //       'static/img/stories',
    //     );
    //     storyData.imageUrl = imageUrl;
    //   }
    //   Object.assign(storyData, updateStoryDto);
    //   const updatedData = {
    //     ...storyData,
    //     updatedAt: new Date(),
    //   };
    //   await storyRef.update(updatedData);
    //   const updatedStorySnapshot: DocumentSnapshot = await storyRef.get();
    //   const updatedStory: Story = {
    //     id: updatedStorySnapshot.id,
    //     title: updatedStorySnapshot.get('title'),
    //     imageUrl: updatedStorySnapshot.get('imageUrl'),
    //     createdAt: updatedStorySnapshot.createTime,
    //     updatedAt: updatedStorySnapshot.updateTime,
    //     ...updateStoryDto,
    //   };
    //   return updatedStory;
    // } catch (error) {
    //   throw new BadRequestException('Story was not updated');
    // }
  }

  async remove(id: string) {
    // try {
    //   const storyRef: DocumentReference =
    //     this.firebaseService.storiesCollection.doc(id);
    //   const storySnapshot: DocumentSnapshot = await storyRef.get();
    //   if (!storySnapshot.exists) {
    //     throw new NotFoundException('Story not found');
    //   }
    //   const storyData: Story = storySnapshot.data() as Story;
    //   const imageUrl = storyData.imageUrl;
    //   const imagePath = this.firebaseService.getPathFromUrl(imageUrl);
    //   try {
    //     await this.firebaseService.deleteFileFromStorage(imagePath);
    //   } catch (error) {
    //     this.logger.warn(
    //       `Failed to delete file ${imagePath} from Firebase Storage. Error: ${error.message}`,
    //     );
    //   }
    //   await storyRef.delete();
    // } catch (error) {
    //   this.logger.error(error);
    //   throw new NotFoundException('Story does not remove');
    // }
  }
}
