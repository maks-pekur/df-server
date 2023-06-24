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
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createStoryDto: CreateStoryDto,
  ) {
    const story = await this.storiesService.createStory(file, createStoryDto);
    return story;
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    const story = await this.storiesService.update(id, file, updateStoryDto);
    return story;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storiesService.remove(id);
    return { message: 'Story successfully removed' };
  }
}
