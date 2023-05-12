import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Popular, PopularSchema } from './entities/popular.entity';
import { PopularsController } from './populars.controller';
import { PopularsService } from './populars.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Popular.name, schema: PopularSchema }]),
  ],
  controllers: [PopularsController],
  providers: [PopularsService],
})
export class PopularsModule {}
