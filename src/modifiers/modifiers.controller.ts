import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
import { ModifiersService } from './modifiers.service';

@Controller('modifiers')
export class ModifiersController {
  constructor(private modifiersService: ModifiersService) {}

  @Post()
  async create(@Body() createModifierDto: CreateModifierDto) {
    const modifier = await this.modifiersService.createModifier(
      createModifierDto,
    );
    return modifier;
  }

  @Get(':id')
  async getModifier(@Param('id') id: string) {
    const modifier = await this.modifiersService.getModifier(id);
    return modifier;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModifierDto: UpdateModifierDto,
  ) {
    const modifier = await this.modifiersService.updateModifier(
      id,
      updateModifierDto,
    );
    return modifier;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.modifiersService.removeModifier(id);
    return { id };
  }
}
