import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IngredientGroupsService } from './ingredient-groups.service';
import { IngredientGroupController } from './ingredients-group.controller';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [ConfigModule],
  controllers: [IngredientsController, IngredientGroupController],
  providers: [IngredientsService, IngredientGroupsService, FirebaseService],
  exports: [IngredientsService, IngredientGroupsService],
})
export class IngredientsModule {}
