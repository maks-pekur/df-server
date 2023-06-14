import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsModule } from 'src/products/products.module';
import { PopularsController } from './populars.controller';
import { PopularsService } from './populars.service';

@Module({
  imports: [ProductsModule, ConfigModule],
  controllers: [PopularsController],
  providers: [PopularsService, FirebaseService],
})
export class PopularsModule {}
