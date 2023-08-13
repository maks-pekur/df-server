import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { ImagesService } from 'src/images/images.service';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { StopList } from 'src/stop-lists/entities/stop-list.entity';
import { UsersModule } from 'src/users/users.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, StopList, Ingredient]),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
  exports: [ProductsService],
})
export class ProductsModule {}
