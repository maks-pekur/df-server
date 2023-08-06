import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IUser } from 'src/common/interfaces/error.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async create(@Req() req: Request, @Body() dto: CreateStoreDto) {
    const user = req.user as IUser;
    const store = await this.storeService.createStore(user.companyId, dto);
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
    @Req() req: Request,
    @Param('storeId') storeId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    const user = req.user as IUser;

    if (!storeId) {
      throw new BadRequestException('storeId as required');
    }

    const store = await this.storeService.updateStore(
      user.companyId,
      storeId,
      dto,
    );

    return store;
  }

  @Delete('/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async delete(@Req() req: Request, @Param('storeId') storeId: string) {
    const user = req.user as IUser;
    const store = await this.storeService.findOne(user.companyId, storeId);

    if (!store) {
      throw new NotFoundException(`Store with id ${storeId} not found`);
    }

    try {
      await this.storeService.remove(storeId);
      return { message: 'Successfully removed' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
