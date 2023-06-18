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
  @UseInterceptors(FileInterceptor('imageUrl'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    await this.ingredientsService.createIngredient(file, createIngredientDto);
    return { message: 'Ingredient successfully created' };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.ingredientsService.updateIngredient(
      id,
      file,
      updateIngredientDto,
    );
    return { message: 'Ingredient successfully updated' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ingredientsService.deleteIngredient(id);
    return { message: 'Ingredient successfully removed' };
  }
}
