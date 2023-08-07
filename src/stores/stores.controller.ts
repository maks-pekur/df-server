import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IEnhancedRequest } from 'src/common/interfaces/request.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async create(@Req() req: IEnhancedRequest, @Body() dto: CreateStoreDto) {
    const store = await this.storeService.createStore(req.user.companyId, dto);
    return store;
  }

  @Get('/:companyId')
  async findAll(@Param('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('сompanyId is required');
    }
    const stores = await this.storeService.findAll(companyId);
    return stores;
  }

  @Get('/:companyId/:storeId')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('storeId') storeId: string,
  ) {
    if (!companyId || !storeId) {
      throw new BadRequestException('Both companyId and id are required');
    }
    const store = await this.storeService.findOne(companyId, storeId);
    return store;
  }

  @Patch('/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async update(
    @Req() req: IEnhancedRequest,
    @Param('storeId') storeId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    if (!storeId) {
      throw new BadRequestException('storeId as required');
    }

    const store = await this.storeService.updateStore(
      req.user.companyId,
      storeId,
      dto,
    );

    return store;
  }

  @Delete('/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async delete(
    @Req() req: IEnhancedRequest,
    @Param('storeId') storeId: string,
  ) {
    await this.storeService.remove(storeId);
    return { message: 'Successfully removed' };
  }
}
