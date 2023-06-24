import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StopListController } from './stop-list.controller';
import { StopListService } from './stop-list.service';

@Module({
  imports: [ConfigModule],
  providers: [StopListService, FirebaseService],
  controllers: [StopListController],
})
export class StopListModule {}
