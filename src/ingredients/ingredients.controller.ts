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
  async findOne(@Param('id') id: string) {
    const ingredient = await this.ingredientsService.getIngredient(id);
    return ingredient;
  }

  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    const ingredient = await this.ingredientsService.createIngredient(
      file,
      createIngredientDto,
    );
    return ingredient;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const ingredient = await this.ingredientsService.updateIngredient(
      id,
      file,
      updateIngredientDto,
    );
    return ingredient;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ingredientsService.removeIngredient(id);
    return { message: 'Ingredient successfully removed' };
  }
}
