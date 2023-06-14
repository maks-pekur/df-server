import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesService } from 'src/categories/categories.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsService } from 'src/products/products.service';
import { PromoCodesService } from 'src/promo-codes/promo-codes.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [ConfigModule],
  controllers: [CartController],
  providers: [
    CartService,
    FirebaseService,
    PromoCodesService,
    ProductsService,
    CategoriesService,
  ],
})
export class CartModule {}
