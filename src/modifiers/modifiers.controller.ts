import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateModifierDto } from './dto/create-modifire.dto';
import { Modifier } from './entities/modifire.entity';
import { ModifiersService } from './modifiers.service';

@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}

  // @Post('/groups')
  // async createModifierGroup(
  //   @Body() modifierGroup: ModifierGroup,
  // ): Promise<string> {
  //   return this.modifiersService.createModifierGroup(modifierGroup);
  // }

  // @Patch('/groups/:groupId')
  // async updateModifierGroup(
  //   @Param('groupId') groupId: string,
  //   @Body() modifierGroup: Partial<ModifierGroup>,
  // ): Promise<void> {
  //   await this.modifiersService.updateModifierGroup(groupId, modifierGroup);
  // }

  // @Get('/groups/:groupId')
  // async getModifierGroup(
  //   @Param('groupId') groupId: string,
  // ): Promise<ModifierGroup> {
  //   return this.modifiersService.getModifierGroup(groupId);
  // }

  // @Delete('/groups/:groupId')
  // async deleteModifierGroup(@Param('groupId') groupId: string): Promise<void> {
  //   await this.modifiersService.deleteModifierGroup(groupId);
  // }

  @Post('/')
  async createModifier(@Body() modifier: Modifier) {
    await this.modifiersService.createModifier(modifier);
    return { message: 'Modifier successfully created' };
  }

  @Patch('/:modifierId')
  async updateModifier(
    @Param('modifierId') modifierId: string,
    @Body() body: CreateModifierDto,
  ) {
    await this.modifiersService.updateModifier(modifierId, body);
    return { message: 'Modifier successfully updated' };
  }

  @Get('/:modifierId')
  async getModifier(@Param('modifierId') modifierId: string) {
    const modifier = await this.modifiersService.getModifier(modifierId);
    return modifier;
  }

  @Delete('/:modifierId')
  async deleteModifier(@Param('modifierId') modifierId: string) {
    await this.modifiersService.deleteModifier(modifierId);
    return { message: 'Modifier successfully removed' };
  }
}
