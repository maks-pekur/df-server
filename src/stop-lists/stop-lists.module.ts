import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StopList } from './entities/stop-list.entity';
import { StopListsService } from './stop-lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([StopList])],
  providers: [StopListsService],
  exports: [StopListsService],
})
export class StopListsModule {}
