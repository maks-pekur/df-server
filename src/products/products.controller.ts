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
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async addProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.productService.addProduct(
      file,
      createProductDto,
    );
    return product;
  }

  @Get('/')
  async getProducts() {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getOneProduct(id);
    return product;
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body,
  ) {
    const product = await this.productService.updateProduct(id, file, body);
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return { message: 'Product successfully deleted' };
  }
}
