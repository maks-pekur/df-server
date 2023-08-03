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

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.storeService.findOne(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return await this.storeService.updateStore(id, dto);
  }

  @Delete('/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('superadmin', 'admin')
  async delete(@Param('id') id: string) {
    await this.storeService.remove(id);
    return { message: 'Successfully removed' };
  }
}
