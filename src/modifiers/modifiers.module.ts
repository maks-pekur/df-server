import { Module } from '@nestjs/common';
import { ModifierGroupsService } from './modifier-groups.service';
import { ModifierGroupsController } from './modifiers-group.controller';
import { ModifiersController } from './modifiers.controller';
import { ModifiersService } from './modifiers.service';

@Module({
  controllers: [ModifiersController, ModifierGroupsController],
  providers: [ModifiersService, ModifierGroupsService],
  exports: [ModifiersService, ModifierGroupsService],
})
export class ModifiersModule {}
