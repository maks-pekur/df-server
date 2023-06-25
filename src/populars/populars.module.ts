import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PopularsController } from './populars.controller';
import { PopularsService } from './populars.service';

@Module({
  imports: [ConfigModule],
  controllers: [PopularsController],
  providers: [PopularsService, FirebaseService],
})
export class PopularsModule {}
