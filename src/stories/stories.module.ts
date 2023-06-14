import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [ConfigModule],
  controllers: [StoriesController],
  providers: [StoriesService, FirebaseService],
})
export class StoriesModule {}
