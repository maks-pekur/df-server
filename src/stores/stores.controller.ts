import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IEnhancedRequest } from 'src/common/interfaces';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Role } from 'src/roles/interfaces';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async create(@Req() req: IEnhancedRequest, @Body() dto: CreateStoreDto) {
    const store = await this.storeService.createStore(req.user.companyId, dto);
    return store;
  }

  @Get()
  async findAll(@Query('company') companySlug: string) {
    if (!companySlug) {
      throw new BadRequestException('company is required');
    }
    const stores = await this.storeService.findAll(companySlug);
    return stores;
  }

  @Get('/:storeSlug')
  async findOne(
    @Query('company') companySlug: string,
    @Param('storeSlug') storeSlug: string,
  ) {
    if (!companySlug || !storeSlug) {
      throw new BadRequestException('Both companyId and id are required');
    }
    const store = await this.storeService.findOne(companySlug, storeSlug);
    return store;
  }

  @Patch('/:storeSlug')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async update(
    @Req() req: IEnhancedRequest,
    @Param('storeSlug') storeSlug: string,
    @Body() dto: UpdateStoreDto,
  ): Promise<Store> {
    if (!storeSlug) {
      throw new BadRequestException('storeSlug is required');
    }

    return await this.storeService.updateStore(
      req.user.companyId,
      storeSlug,
      dto,
    );
  }

  @Delete('/:storeSlug')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async delete(
    @Req() req: IEnhancedRequest,
    @Param('storeSlug') storeSlug: string,
  ) {
    await this.storeService.remove(req.user.companyId, storeSlug);
    return { message: 'Successfully removed' };
  }
}
