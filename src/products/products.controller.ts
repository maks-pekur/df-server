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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IEnhancedRequest } from 'src/common/interfaces';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Role } from 'src/roles/interfaces';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: IEnhancedRequest,
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      console.error('File not provided');
      throw new Error('File not provided');
    }
    return await this.productService.createProduct(
      req.user.companyId,
      dto,
      file,
    );
  }

  @Get()
  async findAll(@Query('company') companySlug: string) {
    if (!companySlug) {
      throw new BadRequestException('Company is required');
    }

    const products = await this.productService.findAll(companySlug);
    return products;
  }

  @Get('/store/:storeSlug')
  async findProductsForStore(
    @Query('company') companySlug: string,
    @Param('storeSlug') storeSlug: string,
  ) {
    return await this.productService.findProductsForStore(
      companySlug,
      storeSlug,
    );
  }

  @Get('/detail/:id')
  async findOne(
    @Query('company') companySlug: string,
    @Param('id') id: string,
  ) {
    if (!companySlug || !id) {
      throw new BadRequestException('Both companySlug and id are required');
    }

    const product = await this.productService.findOne(companySlug, id);

    return product;
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, dto, file);
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async delete(@Req() req: IEnhancedRequest, @Param('id') id: string) {
    await this.productService.removeProduct(req.user.companyId, id);
    return { message: 'Product successfully deleted' };
  }
}
