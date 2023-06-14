import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ModifiersController } from './modifiers.controller';
import { ModifiersService } from './modifiers.service';

@Module({
  imports: [ConfigModule],
  controllers: [ModifiersController],
  providers: [ModifiersService, FirebaseService],
})
export class ModifiersModule {}
