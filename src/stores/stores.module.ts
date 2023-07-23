import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
