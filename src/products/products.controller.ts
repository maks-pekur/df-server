import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
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

  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.productService.createProduct(
      file,
      createProductDto,
    );
    return product;
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      id,
      file,
      updateProductDto,
    );
    return product;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.productService.removeProduct(id);
    return { message: 'Product successfully deleted' };
  }
}
