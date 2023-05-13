import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { PopularsModule } from './populars/populars.module';
import { ProductsModule } from './products/products.module';
import { StoriesModule } from './stories/stories.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MulterModule.register({
      dest: './files',
    }),
    ProductsModule,
    CategoriesModule,
    UploadsModule,
    CartModule,
    UsersModule,
    AuthModule,
    PopularsModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
