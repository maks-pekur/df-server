import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ConfigModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, FirebaseService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
