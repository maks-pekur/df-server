import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/')
  async findAll() {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.getOneProduct(id);
    return product;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(dto, files);
  }

  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, dto, files);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.productService.removeProduct(id);
    return { message: 'Product successfully deleted' };
  }
}
