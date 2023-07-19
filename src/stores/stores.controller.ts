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
import { StoreService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/')
  async create(@Body() createStoreDto: CreateStoreDto) {
    const store = await this.storeService.createStore(createStoreDto);
    return store;
  }

  @Get('/')
  async findAll() {
    const stores = await this.storeService.getStores();
    return stores;
  }

  @Get('/:storeId')
  async findOne(@Param('storeId') storeId: string) {
    const store = await this.storeService.getStore(storeId);
    return store;
  }

  @Patch('/:storeId')
  async update(
    @Param('storeId') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = await this.storeService.updateStore(storeId, updateStoreDto);
    return store;
  }

  @Delete('/:storeId')
  async delete(@Param('storeId') storeId: string) {
    await this.storeService.removeStore(storeId);
    return { message: 'Successfully removed' };
  }
}
