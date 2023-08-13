import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IEnhancedRequest } from 'src/common/interfaces';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Role } from 'src/roles/interfaces';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: IEnhancedRequest,
    @Body() dto: CreateIngredientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      console.error('File not provided');
      throw new Error('File not provided');
    }
    const ingredient = await this.ingredientsService.create(
      req.user.companyId,
      dto,
      file,
    );

    return ingredient;
  }

  @Get()
  async findAll(@Query('restaurantId') restaurantId: string) {
    const ingredients = await this.ingredientsService.findAll(restaurantId);
    return ingredients;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('restaurantId') restaurantId: string,
  ) {
    const ingredient = await this.ingredientsService.findOne(id, restaurantId);
    return ingredient;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const ingredient = await this.ingredientsService.update(
      id,
      file,
      updateIngredientDto,
    );
    return ingredient;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ingredientsService.remove(id);
    return { message: 'Ingredient successfully removed' };
  }
}
