import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesService } from 'src/categories/categories.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, FirebaseService, CategoriesService],
  exports: [ProductsService],
})
export class ProductsModule {}
