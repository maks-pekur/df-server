import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PopularsController } from './populars.controller';
import { PopularsService } from './populars.service';

@Module({
  imports: [ConfigModule],
  controllers: [PopularsController],
  providers: [PopularsService],
})
export class PopularsModule {}
