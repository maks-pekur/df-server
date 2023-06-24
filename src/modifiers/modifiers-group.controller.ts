import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { ModifierGroupsService } from './modifier-groups.service';

@Controller('modifier-groups')
export class ModifierGroupsController {
  constructor(private modifierGroupsService: ModifierGroupsService) {}

  @Post()
  async create(@Body() createModifierGroupDto: CreateModifierGroupDto) {
    const modifierGroup = await this.modifierGroupsService.createModifierGroup(
      createModifierGroupDto,
    );
    return modifierGroup;
  }

  @Get(':id')
  async getModifierGroup(@Param('id') id: string) {
    const modifierGroup = await this.modifierGroupsService.getModifierGroup(id);
    return modifierGroup;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModifierGroupDto: UpdateModifierGroupDto,
  ) {
    const modifierGroup = await this.modifierGroupsService.updateModifierGroup(
      id,
      updateModifierGroupDto,
    );
    return modifierGroup;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.modifierGroupsService.removeModifierGroup(id);
    return { id };
  }
}
