import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Store]),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
