import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  async create(@Body() dto: CreateStoreDto) {
    return await this.storeService.createStore(dto);
  }

  @Get()
  async findAll() {
    return await this.storeService.getStores();
  }

  @Get('/:storeId')
  async findOne(@Param('storeId') storeId: string) {
    return await this.storeService.findOne(storeId);
  }

  @Patch('/:storeId')
  async update(@Param('storeId') storeId: string, @Body() dto: UpdateStoreDto) {
    return await this.storeService.updateStore(storeId, dto);
  }

  @Delete('/:storeId')
  async delete(@Param('storeId') storeId: string) {
    await this.storeService.removeStore(storeId);
    return { message: 'Successfully removed' };
  }
}
