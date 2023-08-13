import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { ImagesService } from 'src/images/images.service';
import { UsersModule } from 'src/users/users.module';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientGroupsService } from './ingredient-groups.service';
import { IngredientGroupController } from './ingredients-group.controller';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient]),
    CompaniesModule,
    UsersModule,
  ],
  controllers: [IngredientsController, IngredientGroupController],
  providers: [IngredientsService, IngredientGroupsService, ImagesService],
  exports: [IngredientsService, IngredientGroupsService],
})
export class IngredientsModule {}
