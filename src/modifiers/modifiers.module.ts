import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ModifierGroupsService } from './modifier-groups.service';
import { ModifierGroupsController } from './modifiers-group.controller';
import { ModifiersController } from './modifiers.controller';
import { ModifiersService } from './modifiers.service';

@Module({
  imports: [ConfigModule],
  controllers: [ModifiersController, ModifierGroupsController],
  providers: [ModifiersService, ModifierGroupsService, FirebaseService],
  exports: [ModifiersService, ModifierGroupsService],
})
export class ModifiersModule {}
