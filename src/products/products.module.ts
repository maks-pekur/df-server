import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FilesService } from 'src/files/files.service';
import { UsersModule } from 'src/users/users.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, FilesService],
})
export class ProductsModule {}
