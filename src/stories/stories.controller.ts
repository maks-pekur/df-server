import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    await this.storiesService.create(file, createStoryDto);
    return { message: 'Story successfully created' };
  }

  @Get()
  async findAll() {
    const stories = await this.storiesService.findAll();
    return stories;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const story = await this.storiesService.findOne(id);
    return story;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    await this.storiesService.update(id, file, updateStoryDto);
    return { message: 'Story successfully updated' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storiesService.remove(id);
    return { message: 'Story successfully removed' };
  }
}
