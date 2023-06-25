import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateIngredientGroupDto } from './dto/create-ingredient-group.dto';
import { UpdateIngredientGroupDto } from './dto/update-ingredient-group.dto';
import { IngredientGroup } from './entities/ingredient.entity';
import { IngredientGroupsService } from './ingredient-groups.service';

@Controller('ingredient-groups')
export class IngredientGroupController {
  constructor(private ingredientGroupsService: IngredientGroupsService) {}

  @Post()
  create(
    @Body() createIngredientGroupDto: CreateIngredientGroupDto,
  ): Promise<IngredientGroup> {
    return this.ingredientGroupsService.createIngredientGroup(
      createIngredientGroupDto,
    );
  }

  @Post('/add/:groupId')
  addIngredientToGroup(
    @Param('groupId') groupId: string,
    @Body('ingredientId') ingredientId: string,
  ): Promise<IngredientGroup> {
    return this.ingredientGroupsService.addIngredientToGroup(
      groupId,
      ingredientId,
    );
  }

  @Delete('/remove/:groupId/')
  removeIngredientFromGroup(
    @Param('groupId') groupId: string,
    @Body('ingredientId') ingredientId: string,
  ): Promise<IngredientGroup> {
    return this.ingredientGroupsService.removeIngredientFromGroup(
      groupId,
      ingredientId,
    );
  }

  @Get()
  findAll(): Promise<IngredientGroup[]> {
    return this.ingredientGroupsService.getAllIngredientGroups();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IngredientGroup> {
    const ingredientGroup = this.ingredientGroupsService.getIngredientGroup(id);

    if (!ingredientGroup) {
      throw new NotFoundException('Ingredient group not found');
    }

    return ingredientGroup;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientGroupDto: UpdateIngredientGroupDto,
  ): Promise<IngredientGroup> {
    return this.ingredientGroupsService.updateIngredientGroup(
      id,
      updateIngredientGroupDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ingredientGroupsService.removeIngredientGroup(id);
  }
}
