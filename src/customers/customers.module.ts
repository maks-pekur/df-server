import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [ConfigModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
