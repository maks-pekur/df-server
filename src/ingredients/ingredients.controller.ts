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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async findAll() {
    const ingredients = await this.ingredientsService.getIngredients();
    return ingredients;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const ingredient = await this.ingredientsService.getIngredient(id);
    return ingredient;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    await this.ingredientsService.createIngredient(file, createIngredientDto);
    return { message: 'Ingredient successfully created' };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.ingredientsService.updateIngredient(id, updateIngredientDto);
    return { message: 'Ingredient successfully updated' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ingredientsService.deleteIngredient(id);
    return { message: 'Ingredient successfully removed' };
  }

  // @Post('groups')
  // async createIngredientGroup(
  //   @Body() group: IngredientGroup,
  // ): Promise<IngredientGroup> {
  //   return this.ingredientsService.createIngredientGroup(group);
  // }

  // @Post('groups/:groupId/ingredients/:ingredientId')
  // async addIngredientToGroup(
  //   @Param('groupId') groupId: string,
  //   @Param('ingredientId') ingredientId: string,
  // ): Promise<IngredientGroup> {
  //   return this.ingredientsService.addIngredientToGroup(groupId, ingredientId);
  // }
}
