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
import { Roles } from 'src/common/decorators';
import { IEnhancedRequest } from 'src/common/interfaces';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Role } from 'src/roles/interfaces';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  create(@Req() req: IEnhancedRequest, @Body() dto: CreateCategoryDto) {
    const category = this.categoriesService.create(req.user.companyId, dto);
    return category;
  }

  @Get()
  findAll(@Query('company') companySlug: string) {
    if (!companySlug) {
      throw new BadRequestException('Company is required');
    }
    return this.categoriesService.findAll(companySlug);
  }

  @Get('/:categoryId')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  findOne(
    @Req() req: IEnhancedRequest,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.findOne(req.user.companyId, categoryId);
  }

  @Patch('/:categoryId/update')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  update(
    @Req() req: IEnhancedRequest,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(req.user.companyId, categoryId, dto);
  }

  @Delete('/:categoryId/delete')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async remove(
    @Req() req: IEnhancedRequest,
    @Param('categoryId') categoryId: string,
  ) {
    await this.categoriesService.remove(req.user.companyId, categoryId);

    return { message: 'Successfully removed' };
  }
}
