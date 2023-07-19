import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateIngredientGroupDto } from './dto/create-ingredient-group.dto';
import { UpdateIngredientGroupDto } from './dto/update-ingredient-group.dto';
import { IngredientGroupsService } from './ingredient-groups.service';

@Controller('ingredient-groups')
export class IngredientGroupController {
  constructor(private ingredientGroupsService: IngredientGroupsService) {}

  @Post()
  create(@Body() createIngredientGroupDto: CreateIngredientGroupDto) {
    return this.ingredientGroupsService.createIngredientGroup(
      createIngredientGroupDto,
    );
  }

  @Post('/add/:groupId')
  addIngredientToGroup(
    @Param('groupId') groupId: string,
    @Body('ingredientId') ingredientId: string,
  ) {
    return this.ingredientGroupsService.addIngredientToGroup(
      groupId,
      ingredientId,
    );
  }

  @Delete('/remove/:groupId/')
  removeIngredientFromGroup(
    @Param('groupId') groupId: string,
    @Body('ingredientId') ingredientId: string,
  ) {
    return this.ingredientGroupsService.removeIngredientFromGroup(
      groupId,
      ingredientId,
    );
  }

  @Get()
  findAll() {
    return this.ingredientGroupsService.getAllIngredientGroups();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const ingredientGroup = this.ingredientGroupsService.getIngredientGroup(id);

    if (!ingredientGroup) {
      throw new NotFoundException('Ingredient group not found');
    }

    return ingredientGroup;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientGroupDto: UpdateIngredientGroupDto,
  ) {
    return this.ingredientGroupsService.updateIngredientGroup(
      id,
      updateIngredientGroupDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientGroupsService.removeIngredientGroup(id);
  }
}
