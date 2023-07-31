import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Story } from './entities/story.entity';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), UsersModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
