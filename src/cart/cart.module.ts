import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsModule } from 'src/products/products.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [ProductsModule, ConfigModule],
  controllers: [CartController],
  providers: [CartService, FirebaseService],
})
export class CartModule {}
