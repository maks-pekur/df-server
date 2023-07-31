import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  @Roles('superadmin', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles('superadmin', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('storeId') storeId: string, @Body() dto: UpdateStoreDto) {
    return await this.storeService.updateStore(storeId, dto);
  }

  @Delete('/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async delete(@Param('storeId') storeId: string) {
    await this.storeService.remove(storeId);
    return { message: 'Successfully removed' };
  }
}
