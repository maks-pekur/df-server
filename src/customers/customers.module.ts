import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [ConfigModule],
  controllers: [CustomersController],
  providers: [CustomersService, FirebaseService],
})
export class CustomersModule {}
