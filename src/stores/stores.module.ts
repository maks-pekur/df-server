import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { UsersModule } from 'src/users/users.module';
import { Store } from './entities/store.entity';
import { StoreController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UsersModule, CompaniesModule],
  controllers: [StoreController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
