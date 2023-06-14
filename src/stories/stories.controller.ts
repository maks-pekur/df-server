import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(createStoryDto);
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
  async update(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    await this.storiesService.update(id, updateStoryDto);
    return { message: 'Story successfully updated' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storiesService.remove(id);
    return { message: 'Story successfully removed' };
  }
}
