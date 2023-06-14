import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [ConfigModule],
  controllers: [IngredientsController],
  providers: [IngredientsService, FirebaseService],
})
export class IngredientsModule {}
