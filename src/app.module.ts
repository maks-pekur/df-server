import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { PopularsModule } from './populars/populars.module';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://maxpekur:cluster@cluster.torlhhm.mongodb.net/?retryWrites=true&w=majority',
    ),
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
})
export class AppModule {}
