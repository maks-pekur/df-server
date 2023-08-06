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
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IUser } from 'src/common/interfaces/error.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  create(@Req() req: Request, @Body() dto: CreateCategoryDto) {
    const user = req.user as IUser;
    const category = this.categoriesService.create(user.companyId, dto);

    return category;
  }

  @Get('/:companyId')
  findAll(@Param('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const categories = this.categoriesService.findAll(companyId);
    return categories;
  }

  @Get('/:companyId/:categoryId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
  ) {
    const category = this.categoriesService.findOne(companyId, categoryId);
    return category;
  }

  @Patch('/:categoryId/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const user = req.user as IUser;
    const category = this.categoriesService.update(
      user.companyId,
      categoryId,
      dto,
    );
    return category;
  }

  @Delete('/:categoryId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async remove(@Req() req: Request, @Param('categoryId') categoryId: string) {
    const user = req.user as IUser;
    await this.categoriesService.remove(user.companyId, categoryId);

    return { message: 'Successfully removed' };
  }
}
