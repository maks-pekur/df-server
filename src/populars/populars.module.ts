import { Module } from '@nestjs/common';
import { PopularsController } from './populars.controller';
import { PopularsService } from './populars.service';

@Module({
  controllers: [PopularsController],
  providers: [PopularsService],
})
export class PopularsModule {}
